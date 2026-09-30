from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int

class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: List[T]
    pagination: PaginationMeta
