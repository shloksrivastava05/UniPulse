import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    student_id = Column(String(50), nullable=True)
    course = Column(String(150), nullable=True)
    graduation_year = Column(String(50), nullable=True)
    role = Column(String(20), nullable=False, default="student")  # 'student' or 'admin'
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
    lost_items = relationship("LostItem", back_populates="user")
    found_items = relationship("FoundItem", back_populates="user")
    reservations = relationship("SpaceReservation", back_populates="user")
    rsvps = relationship("EventRSVP", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class UserInterest(Base):
    __tablename__ = "user_interests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    interest = Column(String(100), nullable=False)

    user = relationship("User", back_populates="interests")
