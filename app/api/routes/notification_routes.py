from collections.abc import Callable

from fastapi import Depends, FastAPI, HTTPException, status

from app.core.access_policy import AccessPolicyAction
from app.schemas.notification_schemas import NotificationResponse
from app.services.accounts import UserAccount
from app.services.notifications import NotificationModule, NotificationNotFound


def register_notification_routes(
    app: FastAPI,
    *,
    get_notifications: Callable,
    require_access: Callable[[AccessPolicyAction], Callable],
) -> None:
    @app.get("/notifications", response_model=list[NotificationResponse])
    async def list_notifications(
        notifications: NotificationModule = Depends(get_notifications),
        current_user: UserAccount = Depends(require_access(AccessPolicyAction.view_notifications)),
    ):
        return notifications.list_notifications(current_user)

    @app.post("/notifications/{notification_id}/read", response_model=NotificationResponse)
    async def mark_notification_read(
        notification_id: str,
        notifications: NotificationModule = Depends(get_notifications),
        current_user: UserAccount = Depends(require_access(AccessPolicyAction.view_notifications)),
    ):
        try:
            return notifications.mark_read(current_user, notification_id)
        except NotificationNotFound:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notifikasi tidak ditemukan.")
