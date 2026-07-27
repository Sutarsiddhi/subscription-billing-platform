from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    Enum
)
from sqlalchemy.orm import relationship

from app.database.database import Base
from app.models.enums import PaymentStatus


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    invoice_id = Column(
        Integer,
        ForeignKey("invoices.id"),
        nullable=False
    )

    amount = Column(
        Numeric(10,2),
        nullable=False
    )

    status = Column(
        Enum(PaymentStatus),
        default=PaymentStatus.PENDING
    )

    gateway_reference = Column(
        String(255)
    )

    attempted_at = Column(DateTime)

    invoice = relationship(
        "Invoice",
        backref="payments"
    )