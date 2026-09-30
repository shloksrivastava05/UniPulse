from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from ..database import Base

def utc_now():
    return datetime.now(timezone.utc)

class StudySpace(Base):
    __tablename__ = "study_spaces"

    id = Column(String(50), primary_key=True)  # e.g., 'spc-1'
    name = Column(String(150), nullable=False)
    location_id = Column(String(50), ForeignKey("campus_locations.id", ondelete="CASCADE"), nullable=False, index=True)
    floor = Column(String(50), nullable=False)
    capacity = Column(Integer, nullable=False, default=30)
    occupied = Column(Integer, nullable=False, default=15)
    noise_level = Column(String(50), nullable=False, default="Quiet")  # 'Silent', 'Moderate', 'Collaborative'
    hours = Column(String(100), nullable=False, default="Open 24/7")
    amenities = Column(JSON, nullable=True)  # List of strings
    suitable_for = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    location = relationship("CampusLocation", back_populates="study_spaces")
    reservations = relationship("SpaceReservation", back_populates="space")
