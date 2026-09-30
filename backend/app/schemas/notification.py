from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class NotificationOut(BaseModel):
    id: str
    type: str
    title: str
    message: str
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[str] = None
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
