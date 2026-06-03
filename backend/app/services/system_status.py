from dataclasses import dataclass

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.storage import PrivateStorage


@dataclass(frozen=True)
class StatusCheck:
    status: str


@dataclass(frozen=True)
class ApplicationStatus:
    name: str
    version: str


@dataclass(frozen=True)
class SystemStatus:
    backend: StatusCheck
    database: StatusCheck
    storage: StatusCheck
    application: ApplicationStatus
    worker: StatusCheck


class SystemStatusModule:
    def __init__(self, *, session: Session, storage: PrivateStorage, worker_enabled: bool = False) -> None:
        self._session = session
        self._storage = storage
        self._worker_enabled = worker_enabled

    def get_system_status(self) -> SystemStatus:
        return SystemStatus(
            backend=StatusCheck(status="ok"),
            database=StatusCheck(status=self._database_status()),
            storage=StatusCheck(status=self._storage_status()),
            application=ApplicationStatus(name="ipb-smart-reserve-hub", version="0.1.0"),
            worker=StatusCheck(status="ok" if self._worker_enabled else "not_used"),
        )

    def _database_status(self) -> str:
        try:
            self._session.execute(text("SELECT 1"))
        except Exception:
            return "unavailable"
        return "ok"

    def _storage_status(self) -> str:
        return "ok" if self._storage is not None else "not_configured"
