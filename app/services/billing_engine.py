"""Core recurring-billing operations.

This service is safe to call from a scheduled worker or the operations API.
"""
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.enums import BillingInterval, InvoiceStatus, NotificationType, RetryOutcome, SubscriptionStatus
from app.models.invoice import Invoice
from app.models.payment_retry import PaymentRetry
from app.models.subscription import Subscription
from app.services.notifications import notify


def _cycle_end(start: datetime, interval: BillingInterval) -> datetime:
    return start + timedelta(days=365 if interval == BillingInterval.ANNUAL else 30)


def _issue_invoice(db: Session, subscription: Subscription) -> Invoice:
    plan = subscription.plan
    subtotal = Decimal(plan.price)
    tax = (subtotal * Decimal("0.18")).quantize(Decimal("0.01"))
    invoice = Invoice(
        subscription_id=subscription.id,
        invoice_number=f"BW-{datetime.utcnow():%Y%m%d}-{uuid4().hex[:6].upper()}",
        subtotal=subtotal,
        tax_amount=tax,
        total_amount=subtotal + tax,
        status=InvoiceStatus.PENDING,
        issued_at=datetime.utcnow(),
        due_date=subscription.current_period_end,
    )
    db.add(invoice)
    notify(
        db, subscription.customer_id, NotificationType.INVOICE_GENERATED,
        "Invoice generated", f"Invoice {invoice.invoice_number} is ready for {invoice.total_amount}.",
    )
    return invoice


def issue_invoice(db: Session, subscription: Subscription) -> Invoice:
    """Public invoice factory used for initial and renewal billing."""
    return _issue_invoice(db, subscription)


def process_due_billing_cycles(db: Session, now: datetime | None = None) -> dict[str, int]:
    """Convert completed trials and renew active subscriptions exactly once per due cycle."""
    now = now or datetime.utcnow()
    converted_trials = 0
    renewed = 0
    invoices_created = 0

    trials = db.query(Subscription).filter(
        Subscription.status == SubscriptionStatus.TRIAL,
        Subscription.trial_ends_at.isnot(None),
        Subscription.trial_ends_at <= now,
    ).all()
    for subscription in trials:
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.current_period_start = now
        subscription.current_period_end = _cycle_end(now, subscription.plan.billing_interval)
        _issue_invoice(db, subscription)
        converted_trials += 1
        invoices_created += 1

    due_subscriptions = db.query(Subscription).filter(
        Subscription.status == SubscriptionStatus.ACTIVE,
        Subscription.current_period_end.isnot(None),
        Subscription.current_period_end <= now,
    ).all()
    for subscription in due_subscriptions:
        if subscription.cancel_at_period_end:
            subscription.status = SubscriptionStatus.CANCELLED
            notify(db, subscription.customer_id, NotificationType.SUBSCRIPTION_CANCELLED,
                   "Subscription cancelled", "Your subscription ended at the close of its billing period.")
            continue
        subscription.current_period_start = now
        subscription.current_period_end = _cycle_end(now, subscription.plan.billing_interval)
        _issue_invoice(db, subscription)
        renewed += 1
        invoices_created += 1

    db.commit()
    return {"trials_converted": converted_trials, "subscriptions_renewed": renewed, "invoices_created": invoices_created}


def process_due_payment_retries(db: Session, now: datetime | None = None) -> int:
    """Surface each scheduled recovery attempt once for the payment gateway/UI.

    This deliberately does not manufacture a successful payment: the gateway must
    call the payment-confirmation endpoint with the actual result.
    """
    now = now or datetime.utcnow()
    retries = db.query(PaymentRetry).filter(
        PaymentRetry.outcome == RetryOutcome.PENDING,
        PaymentRetry.scheduled_for <= now,
        PaymentRetry.notified_at.is_(None),
    ).all()
    for retry in retries:
        retry.notified_at = now
        subscription = retry.payment.invoice.subscription
        notify(db, subscription.customer_id, NotificationType.PAYMENT_RETRY,
               "Payment retry due", f"Retry {retry.attempt_number} is due for invoice {retry.payment.invoice.invoice_number}.")
    db.commit()
    return len(retries)
