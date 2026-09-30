from typing import List, Optional
from pydantic import BaseModel

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    student_id: Optional[str] = None
    course: Optional[str] = None
    graduation_year: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None
    interests: List[str] = []

    class Config:
        from_attributes = True

class InterestCreate(BaseModel):
    interest: str

class NotificationPreferences(BaseModel):
    ai_match_alerts: bool = True
    study_space_availability: bool = True
    event_reminders: bool = True
