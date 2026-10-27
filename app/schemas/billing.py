from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import InvoiceStatus, NotificationType, PaymentStatus


class InvoiceResponse(BaseModel):
    id: int
    subscription_id: int
    invoice_number: str
    subtotal: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    status: InvoiceStatus
    issued_at: datetime | None = None
    due_date: datetime | None = None
    model_config = ConfigDict(from_attributes=True)


class PaymentCreate(BaseModel):
    amount: Decimal | None = None
    gateway_reference: str | None = None
    status: PaymentStatus = PaymentStatus.SUCCEEDED


class PlanChange(BaseModel):
    plan_id: int


class NotificationResponse(BaseModel):
    id: int
    customer_id: int
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PaymentResponse(BaseModel):
    id: int
    invoice_id: int
    amount: Decimal
    status: PaymentStatus
    gateway_reference: str | None = None
    attempted_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)


class DashboardMetrics(BaseModel):
    customers: int
    active_plans: int
    active_subscriptions: int
    open_invoices: int
    successful_payments: int
    revenue_collected: Decimal
