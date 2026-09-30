import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class LostItem(Base):
    __tablename__ = "lost_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    color = Column(String(50), nullable=True)
    brand = Column(String(100), nullable=True)
    location_name = Column(String(150), nullable=False)
    date_lost = Column(String(100), nullable=False)
    identifying_marks = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(30), nullable=False, default="LOST")  # 'LOST', 'MATCHED', 'CLAIM_PENDING', 'RESOLVED', 'CANCELLED'
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    user = relationship("User", back_populates="lost_items")
    matches = relationship("ItemMatch", back_populates="lost_item", cascade="all, delete-orphan")
