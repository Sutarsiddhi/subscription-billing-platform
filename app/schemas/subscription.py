from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.models.enums import SubscriptionStatus


class SubscriptionCreate(BaseModel):
    customer_id: int
    plan_id: int


class SubscriptionUpdate(BaseModel):
    status: SubscriptionStatus | None = None
    cancel_at_period_end: bool | None = None


class SubscriptionResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    status: SubscriptionStatus
    trial_ends_at: datetime | None = None
    current_period_start: datetime | None = None
    current_period_end: datetime | None = None
    cancel_at_period_end: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)