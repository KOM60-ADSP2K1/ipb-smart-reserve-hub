from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: str
    actor_id: str | None
    actor_email: str | None
    action_type: str
    target_type: str
    target_id: str
    facility_id: str | None
    student_id: str | None
    reservation_id: str | None
    created_at: datetime
