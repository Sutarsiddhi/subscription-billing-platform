from sqlalchemy import (
    Column,
    Integer,
    String,
    JSON,
    DateTime,
    Enum
)
from sqlalchemy.sql import func

from app.database.database import Base
from app.models.enums import EntityType


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    entity_type = Column(
        Enum(EntityType),
        nullable=False
    )

    entity_id = Column(Integer)

    event = Column(String(255))

    actor = Column(String(100))

    event_metadata = Column(JSON)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )