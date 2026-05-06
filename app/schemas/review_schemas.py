from datetime import datetime

from pydantic import BaseModel, Field


class ReviewSubmissionRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class StudentReviewResponse(BaseModel):
    id: str
    reservation_id: str
    facility_id: str
    rating: int
    comment: str | None
    author_name: str
    is_deleted: bool
    edit_warning: str


class StaffFacilityReviewResponse(BaseModel):
    id: str
    reservation_id: str
    rating: int
    comment: str | None
    author_name: str
    created_at: datetime


class StaffFacilityStatisticsResponse(BaseModel):
    facility_id: str
    review_count: int
    rating_average: float | None
    total_reservation_count: int
    completed_reservation_count: int
