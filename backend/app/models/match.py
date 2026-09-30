import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class ItemMatch(Base):
    __tablename__ = "item_matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    lost_item_id = Column(String(36), ForeignKey("lost_items.id", ondelete="CASCADE"), nullable=False, index=True)
    found_item_id = Column(String(36), ForeignKey("found_items.id", ondelete="CASCADE"), nullable=False, index=True)
    
    overall_score = Column(Integer, nullable=False, default=91)  # 0 to 100
    visual_score = Column(Float, nullable=False, default=90.0)
    category_score = Column(Float, nullable=False, default=100.0)
    location_score = Column(Float, nullable=False, default=92.0)
    description_score = Column(Float, nullable=False, default=88.0)
    time_score = Column(Float, nullable=False, default=95.0)

    confidence_level = Column(String(50), nullable=False, default="High Confidence")
    match_factors = Column(JSON, nullable=True)  # List of { factor, passed, detail }
    status = Column(String(30), nullable=False, default="PENDING_REVIEW")  # 'PENDING_REVIEW', 'APPROVED', 'CLAIMED', 'REJECTED'

    reviewed_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    lost_item = relationship("LostItem", back_populates="matches")
    found_item = relationship("FoundItem", back_populates="matches")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
