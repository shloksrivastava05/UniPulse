import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class FoundItem(Base):
    __tablename__ = "found_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    color = Column(String(50), nullable=True)
    brand = Column(String(100), nullable=True)
    location_found = Column(String(150), nullable=False)
    date_found = Column(String(100), nullable=False)
    custody_desk = Column(String(150), nullable=False, default="Student Commons Info Desk")
    image_url = Column(String(500), nullable=True)
    status = Column(String(30), nullable=False, default="FOUND")  # 'FOUND', 'MATCHED', 'RESOLVED'
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    user = relationship("User", back_populates="found_items")
    matches = relationship("ItemMatch", back_populates="found_item", cascade="all, delete-orphan")
