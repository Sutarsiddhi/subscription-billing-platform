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
from sqlalchemy.sql import func

from app.database.database import Base
from app.models.enums import InvoiceStatus


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    subscription_id = Column(
        Integer,
        ForeignKey("subscriptions.id"),
        nullable=False
    )

    invoice_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    subtotal = Column(
        Numeric(10,2),
        nullable=False
    )

    tax_amount = Column(
        Numeric(10,2),
        default=0
    )

    total_amount = Column(
        Numeric(10,2),
        nullable=False
    )

    status = Column(
        Enum(InvoiceStatus),
        default=InvoiceStatus.PENDING
    )

    pdf_path = Column(String(255))

    issued_at = Column(DateTime)

    due_date = Column(DateTime)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    subscription = relationship(
        "Subscription",
        backref="invoices"
    )