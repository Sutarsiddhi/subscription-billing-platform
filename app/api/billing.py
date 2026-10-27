from datetime import datetime, timedelta
from io import BytesIO
from decimal import Decimal
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.subscription import Subscription
from app.models.plan import Plan
from app.models.enums import InvoiceStatus, NotificationType, PaymentStatus, RetryOutcome, SubscriptionStatus
from app.models.notification import Notification
from app.models.payment_retry import PaymentRetry
from app.schemas.billing import DashboardMetrics, InvoiceResponse, NotificationResponse, PaymentCreate, PaymentResponse, PlanChange
from app.services.billing_engine import issue_invoice
from app.services.notifications import notify
from app.tasks.billing import process_due_billing_cycles_task

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.post("/process-cycles")
def process_billing_cycles(db: Session = Depends(get_db)):
    """Queue billing-cycle processing; a Celery worker performs the database work."""
    del db  # Dependency keeps the API signature uniform; task owns its DB session.
    task = process_due_billing_cycles_task.delay()
    return {"task_id": task.id, "status": "queued"}


@router.get("/invoices", response_model=list[InvoiceResponse])
def list_invoices(customer_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Invoice).join(Subscription)
    if customer_id is not None:
        query = query.filter(Subscription.customer_id == customer_id)
    return query.order_by(Invoice.created_at.desc()).all()


@router.post("/subscriptions/{subscription_id}/invoice", response_model=InvoiceResponse)
def create_invoice(subscription_id: int, db: Session = Depends(get_db)):
    subscription = db.get(Subscription, subscription_id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    invoice = issue_invoice(db, subscription)
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/invoices/{invoice_id}/pdf")
def download_invoice_pdf(invoice_id: int, db: Session = Depends(get_db)):
    """Render an invoice on demand; no local PDF files are required."""
    invoice = db.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise HTTPException(status_code=503, detail="PDF generation dependency is unavailable") from exc

    subscription, customer, plan = invoice.subscription, invoice.subscription.customer, invoice.subscription.plan
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    _, height = A4
    lines = [
        "BillWise Invoice", "",
        f"Invoice: {invoice.invoice_number}", f"Issued: {invoice.issued_at:%Y-%m-%d}",
        f"Due: {invoice.due_date:%Y-%m-%d}", "",
        f"Bill to: {customer.name}", customer.email, customer.billing_country, "",
        f"Plan: {plan.name} ({plan.billing_interval.value})",
        f"Billing period ends: {subscription.current_period_end:%Y-%m-%d}", "",
        f"Subtotal: {plan.currency} {invoice.subtotal}", f"Tax: {plan.currency} {invoice.tax_amount}",
        f"Total: {plan.currency} {invoice.total_amount}", f"Payment status: {invoice.status.value}",
    ]
    y = height - 54
    for line in lines:
        pdf.drawString(54, y, line)
        y -= 22
    pdf.save()
    return Response(content=buffer.getvalue(), media_type="application/pdf", headers={
        "Content-Disposition": f'attachment; filename="{invoice.invoice_number}.pdf"'
    })


@router.post("/invoices/{invoice_id}/payments", response_model=PaymentResponse)
def record_payment(invoice_id: int, payload: PaymentCreate, db: Session = Depends(get_db)):
    invoice = db.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    payment = Payment(
        invoice_id=invoice.id,
        amount=payload.amount if payload.amount is not None else invoice.total_amount,
        status=payload.status,
        gateway_reference=payload.gateway_reference,
        attempted_at=datetime.utcnow(),
    )
    if payload.status == PaymentStatus.SUCCEEDED:
        invoice.status = InvoiceStatus.PAID
        invoice.subscription.status = SubscriptionStatus.ACTIVE
        pending_retries = db.query(PaymentRetry).join(Payment).filter(
            Payment.invoice_id == invoice.id,
            PaymentRetry.outcome == RetryOutcome.PENDING,
        ).all()
        for retry in pending_retries:
            retry.outcome = RetryOutcome.SUCCEEDED
        notify(db, invoice.subscription.customer_id, NotificationType.PAYMENT_SUCCEEDED,
               "Payment successful", f"Payment for invoice {invoice.invoice_number} was confirmed.")
    elif payload.status == PaymentStatus.FAILED:
        invoice.subscription.status = SubscriptionStatus.PAST_DUE
        retry_count = db.query(PaymentRetry).join(Payment).filter(Payment.invoice_id == invoice.id).count()
        if retry_count < 3:
            retry = PaymentRetry(
                payment=payment, attempt_number=retry_count + 1,
                scheduled_for=datetime.utcnow() + timedelta(days=(1, 3, 7)[retry_count]),
                outcome=RetryOutcome.PENDING,
            )
            db.add(retry)
            notify(db, invoice.subscription.customer_id, NotificationType.PAYMENT_FAILED,
                   "Payment failed", f"Payment for invoice {invoice.invoice_number} failed; retry {retry.attempt_number} is scheduled.")
        else:
            notify(db, invoice.subscription.customer_id, NotificationType.PAYMENT_FAILED,
                   "Payment failed", f"Payment for invoice {invoice.invoice_number} failed after all retry attempts.")
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.post("/subscriptions/{subscription_id}/change-plan", response_model=InvoiceResponse)
def change_plan(subscription_id: int, payload: PlanChange, db: Session = Depends(get_db)):
    """Apply a mid-cycle plan change and create a prorated debit or credit invoice."""
    subscription = db.get(Subscription, subscription_id)
    new_plan = db.get(Plan, payload.plan_id)
    if not subscription or not new_plan or not new_plan.is_active:
        raise HTTPException(status_code=404, detail="Subscription or active plan not found")
    if subscription.status not in (SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL):
        raise HTTPException(status_code=409, detail="Only active or trial subscriptions can change plans")
    if subscription.plan_id == new_plan.id:
        raise HTTPException(status_code=409, detail="Subscription is already on this plan")
    now = datetime.utcnow()
    start, end = subscription.current_period_start, subscription.current_period_end
    total_seconds = max((end - start).total_seconds(), 1) if start and end else 1
    remaining = max((end - now).total_seconds(), 0) if end else 0
    adjustment = ((Decimal(new_plan.price) - Decimal(subscription.plan.price)) * Decimal(str(remaining / total_seconds))).quantize(Decimal("0.01"))
    tax = (adjustment * Decimal("0.18")).quantize(Decimal("0.01"))
    subscription.plan_id = new_plan.id
    invoice = Invoice(subscription_id=subscription.id, invoice_number=f"BW-{now:%Y%m%d}-{uuid4().hex[:6].upper()}",
                      subtotal=adjustment, tax_amount=tax, total_amount=adjustment + tax,
                      status=InvoiceStatus.PAID if adjustment <= 0 else InvoiceStatus.PENDING,
                      issued_at=now, due_date=now)
    db.add(invoice)
    notify(db, subscription.customer_id, NotificationType.INVOICE_GENERATED,
           "Plan changed", f"Your plan was changed to {new_plan.name}. Proration adjustment: {invoice.total_amount}.")
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/payments", response_model=list[PaymentResponse])
def list_payments(customer_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Payment).join(Invoice).join(Subscription)
    if customer_id is not None:
        query = query.filter(Subscription.customer_id == customer_id)
    return query.order_by(Payment.attempted_at.desc()).all()


@router.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(customer_id: int, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.customer_id == customer_id).order_by(Notification.created_at.desc()).all()


@router.post("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.get("/dashboard", response_model=DashboardMetrics)
def dashboard_metrics(db: Session = Depends(get_db)):
    revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(Payment.status == PaymentStatus.SUCCEEDED).scalar()
    return DashboardMetrics(
        customers=db.query(Customer).count(),
        active_plans=db.query(Plan).filter(Plan.is_active.is_(True)).count(),
        active_subscriptions=db.query(Subscription).filter(Subscription.status.in_([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL])).count(),
        open_invoices=db.query(Invoice).filter(Invoice.status.in_([InvoiceStatus.PENDING, InvoiceStatus.OVERDUE])).count(),
        successful_payments=db.query(Payment).filter(Payment.status == PaymentStatus.SUCCEEDED).count(),
        revenue_collected=Decimal(revenue),
    )
