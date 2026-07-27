from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Enum
)
from sqlalchemy.orm import relationship

from app.database.database import Base
from app.models.enums import RetryOutcome


class PaymentRetry(Base):
    __tablename__ = "payment_retries"

    id = Column(Integer, primary_key=True, index=True)

    payment_id = Column(
        Integer,
        ForeignKey("payments.id"),
        nullable=False
    )

    attempt_number = Column(Integer)

    scheduled_for = Column(DateTime)

    outcome = Column(
        Enum(RetryOutcome),
        default=RetryOutcome.PENDING
    )

    payment = relationship(
        "Payment",
        backref="retries"
    )