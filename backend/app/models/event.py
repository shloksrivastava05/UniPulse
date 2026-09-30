import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class CampusEvent(Base):
    __tablename__ = "campus_events"

    id = Column(String(50), primary_key=True)  # e.g., 'evt-1'
    title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # 'Tech', 'Clubs', 'Workshops', 'Sports', 'Cultural'
    date_text = Column(String(100), nullable=False)
    time_text = Column(String(100), nullable=False)
    location_name = Column(String(150), nullable=False)
    organizer = Column(String(150), nullable=False)
    attendees_count = Column(Integer, nullable=False, default=0)
    ai_recommendation_reason = Column(String(255), nullable=True)
    badge = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    tags = Column(JSON, nullable=True)  # List of string tags
    start_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    rsvps = relationship("EventRSVP", back_populates="event", cascade="all, delete-orphan")

class EventRSVP(Base):
    __tablename__ = "event_rsvps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = Column(String(50), ForeignKey("campus_events.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=utc_now)

    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_user_event_rsvp"),
    )

    # Relationships
    user = relationship("User", back_populates="rsvps")
    event = relationship("CampusEvent", back_populates="rsvps")
