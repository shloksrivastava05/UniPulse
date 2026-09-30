from sqlalchemy import Column, String, Float, Text, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class CampusLocation(Base):
    __tablename__ = "campus_locations"

    id = Column(String(50), primary_key=True)  # e.g., 'bld-34', 'bld-lib'
    code = Column(String(20), nullable=False)   # e.g., 'B-34'
    name = Column(String(150), nullable=False)
    short_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # 'Academic', 'Study', 'Food', etc.
    faculty = Column(String(150), nullable=True)
    
    # Map coordinates for interactive vector SVG
    x = Column(Float, nullable=False, default=400)
    y = Column(Float, nullable=False, default=250)
    width = Column(Float, nullable=False, default=90)
    height = Column(Float, nullable=False, default=75)

    distance = Column(String(50), nullable=False, default="150m")
    walking_time = Column(String(50), nullable=False, default="2 min walk")
    status = Column(String(50), nullable=False, default="Open")
    hours = Column(String(100), nullable=False, default="8:00 AM – 10:00 PM")
    description = Column(Text, nullable=True)
    facilities = Column(JSON, nullable=True)  # List of facility strings
    image_url = Column(String(500), nullable=True)

    # Relationships
    study_spaces = relationship("StudySpace", back_populates="location")
