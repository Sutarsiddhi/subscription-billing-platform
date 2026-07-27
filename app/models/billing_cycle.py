from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base
from app.models.enums import BillingCycleStatus


class BillingCycle(Base):
    __tablename__ = "billing_cycles"

    id = Column(Integer, primary_key=True, index=True)

    subscription_id = Column(
        Integer,
        ForeignKey("subscriptions.id"),
        nullable=False
    )

    cycle_start = Column(DateTime)

    cycle_end = Column(DateTime)

    status = Column(
        Enum(BillingCycleStatus),
        default=BillingCycleStatus.PENDING
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    subscription = relationship(
        "Subscription",
        backref="billing_cycles"
    )