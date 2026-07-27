from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(120), unique=True, nullable=False)

    billing_country = Column(String(100), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())