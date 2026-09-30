from typing import List, Optional
from pydantic import BaseModel

class MapCoords(BaseModel):
    x: float
    y: float
    width: float
    height: float

class LocationOut(BaseModel):
    id: str
    code: str
    name: str
    short_name: str
    category: str
    faculty: Optional[str] = None
    map_coords: MapCoords
    distance: str
    walking_time: str
    status: str
    hours: str
    description: Optional[str] = None
    facilities: List[str] = []
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
