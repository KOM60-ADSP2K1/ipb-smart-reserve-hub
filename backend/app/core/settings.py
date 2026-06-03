import os
from collections.abc import Mapping
from dataclasses import dataclass

from app.core.student_email_policy import DEFAULT_ALLOWED_STUDENT_EMAIL_DOMAINS, normalize_allowed_student_email_domains

DEFAULT_DATABASE_URL = "sqlite+pysqlite:///./ipb_smart_reserve_hub.db"
DEFAULT_SECRET_KEY = "dev-secret-change-me"
PRODUCTION_ENVIRONMENT = "production"
RAILWAY_VOLUME_MOUNT_PATH = "RAILWAY_VOLUME_MOUNT_PATH"


@dataclass(frozen=True)
class SettingsModule:
    database_url: str = DEFAULT_DATABASE_URL
    secret_key: str = DEFAULT_SECRET_KEY
    allowed_student_email_domains: tuple[str, ...] = DEFAULT_ALLOWED_STUDENT_EMAIL_DOMAINS
    private_storage_path: str | None = None

    @classmethod
    def from_environment(cls, environ: Mapping[str, str] | None = None) -> "SettingsModule":
        source = environ if environ is not None else os.environ
        settings = cls(
            database_url=source.get("IPB_DATABASE_URL", DEFAULT_DATABASE_URL),
            secret_key=source.get("IPB_SECRET_KEY", DEFAULT_SECRET_KEY),
            allowed_student_email_domains=cls._parse_allowed_domains(
                source.get("IPB_ALLOWED_STUDENT_EMAIL_DOMAINS")
            ),
            private_storage_path=source.get("IPB_PRIVATE_STORAGE_PATH") or source.get(RAILWAY_VOLUME_MOUNT_PATH),
        )
        if source.get("IPB_ENVIRONMENT") == PRODUCTION_ENVIRONMENT:
            settings._validate_production(source)
        return settings

    def with_overrides(
        self,
        *,
        database_url: str | None = None,
        secret_key: str | None = None,
        allowed_student_email_domains: tuple[str, ...] | None = None,
        private_storage_path: str | None = None,
    ) -> "SettingsModule":
        return SettingsModule(
            database_url=database_url or self.database_url,
            secret_key=secret_key or self.secret_key,
            allowed_student_email_domains=self._normalize_allowed_domains(
                allowed_student_email_domains or self.allowed_student_email_domains
            ),
            private_storage_path=private_storage_path or self.private_storage_path,
        )

    @staticmethod
    def _parse_allowed_domains(raw_domains: str | None) -> tuple[str, ...]:
        if raw_domains is None:
            return DEFAULT_ALLOWED_STUDENT_EMAIL_DOMAINS
        return SettingsModule._normalize_allowed_domains(tuple(raw_domains.split(",")))

    @staticmethod
    def _normalize_allowed_domains(domains: tuple[str, ...]) -> tuple[str, ...]:
        return normalize_allowed_student_email_domains(domains)

    def _validate_production(self, source: Mapping[str, str]) -> None:
        if not source.get("IPB_DATABASE_URL") or not source.get("IPB_SECRET_KEY"):
            raise ValueError("Production settings require IPB_DATABASE_URL and IPB_SECRET_KEY.")
        if self.database_url.startswith("sqlite") or self.secret_key == DEFAULT_SECRET_KEY:
            raise ValueError("Production settings require IPB_DATABASE_URL and IPB_SECRET_KEY.")
