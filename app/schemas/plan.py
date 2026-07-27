from decimal import Decimal
from pydantic import BaseModel, ConfigDict

from app.models.enums import BillingInterval


# Create Plan Request
class PlanCreate(BaseModel):
    name: str
    price: Decimal
    billing_interval: BillingInterval
    trial_days: int = 0


# Update Plan Request
class PlanUpdate(BaseModel):
    name: str | None = None
    price: Decimal | None = None
    billing_interval: BillingInterval | None = None
    trial_days: int | None = None
    is_active: bool | None = None


# Response
class PlanResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    billing_interval: BillingInterval
    trial_days: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)