from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from .lost_found import LostItemOut, FoundItemOut

class MatchFactor(BaseModel):
    factor: str
    passed: bool
    detail: str

class MatchOut(BaseModel):
    id: str
    overall_score: int
    visual_score: float
    category_score: float
    location_score: float
    description_score: float
    time_score: float
    confidence_level: str
    status: str
    match_factors: List[MatchFactor]
    lost_item: LostItemOut
    found_item: FoundItemOut
    created_at: datetime

    class Config:
        from_attributes = True

class MatchReviewIn(BaseModel):
    status: str  # 'APPROVED' or 'REJECTED'
