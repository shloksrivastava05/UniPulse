from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class LostReportCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    location_name: str
    date_lost: str
    identifying_marks: Optional[str] = None
    image_url: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None

class FoundReportCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    location_found: str
    date_found: str
    custody_desk: str = "Student Commons Info Desk"
    image_url: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None

class LostItemOut(BaseModel):
    id: str
    user_id: str
    reported_by_name: str
    title: str
    category: str
    description: Optional[str] = None
    location: str
    date: str
    identifying_marks: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class FoundItemOut(BaseModel):
    id: str
    user_id: str
    reported_by_name: str
    title: str
    category: str
    description: Optional[str] = None
    location: str
    date: str
    custody_desk: str
    image_url: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
