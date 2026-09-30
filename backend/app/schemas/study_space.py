from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class StudySpaceOut(BaseModel):
    id: str
    name: str
    building_id: str
    building_name: str
    floor: str
    capacity: int
    available_desks: int
    occupied: int
    noise_level: str
    distance: str
    walk_time: str
    is_open: bool = True
    hours: str
    amenities: List[str] = []
    suitable_for: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    study_space_id: str
    duration_minutes: int = 45  # e.g., 45, 120, 240
    start_time: Optional[datetime] = None

class ReservationOut(BaseModel):
    id: str
    study_space_id: str
    space_name: str
    building_name: str
    floor: str
    duration_minutes: int
    start_time: datetime
    end_time: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
