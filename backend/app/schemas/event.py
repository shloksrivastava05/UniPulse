from typing import List, Optional
from pydantic import BaseModel

class EventOut(BaseModel):
    id: str
    title: str
    category: str
    date: str
    time: str
    location: str
    organizer: str
    attendees_count: int
    ai_recommendation_reason: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = []
    is_rsvpd: bool = False

    class Config:
        from_attributes = True

class RSVPOut(BaseModel):
    event_id: str
    title: str
    is_rsvpd: bool
    attendees_count: int
