from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, Enum
from sqlalchemy.sql import func

from app.database.database import Base
from app.models.enums import BillingInterval


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    price = Column(Numeric(10, 2), nullable=False)

    billing_interval = Column(
        Enum(BillingInterval),
        nullable=False
    )

    trial_days = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())