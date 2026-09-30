import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # 'MATCH', 'RESERVATION', 'EVENT', 'NOTICE'
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    related_entity_type = Column(String(50), nullable=True)  # 'match', 'reservation', 'event'
    related_entity_id = Column(String(100), nullable=True)
    read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")
