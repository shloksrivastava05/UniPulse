import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class SpaceReservation(Base):
    __tablename__ = "space_reservations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    study_space_id = Column(String(50), ForeignKey("study_spaces.id", ondelete="CASCADE"), nullable=False, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=45)
    status = Column(String(30), nullable=False, default="CONFIRMED")  # 'CONFIRMED', 'CANCELLED', 'EXPIRED'
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    user = relationship("User", back_populates="reservations")
    space = relationship("StudySpace", back_populates="reservations")
