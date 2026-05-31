import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from app.api.routes.system_status_routes import register_system_status_routes
from app.core.access_policy import AccessPolicyAction
from app.main import create_app
from app.models import UserRole
from app.services.system_status import ApplicationStatus, StatusCheck, SystemStatus
from tests.data_builder import DataBuilder


@pytest.mark.anyio
async def test_demo_smoke_check_reports_backend_and_database_health():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "backend": {"status": "ok"},
        "database": {"status": "ok"},
        "application": {"name": "ipb-smart-reserve-hub", "version": "0.1.0"},
    }


@pytest.mark.anyio
async def test_demo_smoke_check_fails_when_database_is_unavailable():
    class UnavailableSystemStatusModule:
        def get_system_status(self):
            return SystemStatus(
                backend=StatusCheck(status="ok"),
                database=StatusCheck(status="unavailable"),
                storage=StatusCheck(status="not_configured"),
                application=ApplicationStatus(name="ipb-smart-reserve-hub", version="0.1.0"),
                worker=StatusCheck(status="not_configured"),
            )

    async def get_system_status():
        return UnavailableSystemStatusModule()

    def require_access(_: AccessPolicyAction):
        async def dependency():
            return None

        return dependency

    app = FastAPI()
    register_system_status_routes(app, get_system_status=get_system_status, require_access=require_access)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 503
    assert response.json()["database"] == {"status": "unavailable"}


@pytest.mark.anyio
async def test_super_admin_views_read_only_system_status():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    DataBuilder(app).create_user(email="admin@ipb.ac.id", role=UserRole.super_admin)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login = await client.post("/auth/login", json={"email": "admin@ipb.ac.id", "password": "secret123"})
        token = login.json()["access_token"]

        response = await client.get("/admin/system-status", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json() == {
        "backend": {"status": "ok"},
        "database": {"status": "ok"},
        "storage": {"status": "not_configured"},
        "application": {"name": "ipb-smart-reserve-hub", "version": "0.1.0"},
        "worker": {"status": "not_configured"},
    }


@pytest.mark.anyio
async def test_non_admin_users_cannot_view_system_status():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    DataBuilder(app).create_user(email="staff@ipb.ac.id", role=UserRole.staff)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login = await client.post("/auth/login", json={"email": "staff@ipb.ac.id", "password": "secret123"})
        token = login.json()["access_token"]

        response = await client.get("/admin/system-status", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 403
