from datetime import datetime

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    reservation_id: str | None
    title: str
    message: str
    created_at: datetime
    read_at: datetime | None = None
