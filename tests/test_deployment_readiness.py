from pathlib import Path
import tomllib


REPO_ROOT = Path(__file__).resolve().parents[1]


def test_railway_backend_deployment_runs_fastapi_and_smoke_checks_health():
    railway_config = tomllib.loads((REPO_ROOT / "railway.toml").read_text())

    assert railway_config["build"]["builder"] == "NIXPACKS"
    assert railway_config["deploy"]["startCommand"] == (
        "uvicorn app.main:create_app --factory --host 0.0.0.0 --port $PORT"
    )
    assert railway_config["deploy"]["healthcheckPath"] == "/health"


def test_backend_deployment_guide_covers_demo_readiness_topics():
    guide = (REPO_ROOT / "docs" / "backend-deployment.md").read_text()

    for required_text in [
        "Railway backend deployment",
        "IPB_ENVIRONMENT=production",
        "IPB_DATABASE_URL",
        "IPB_SECRET_KEY",
        "PostgreSQL",
        "uvicorn app.main:create_app --factory",
        "GET /health",
        "public facility images",
        "private reservation files",
        "worker/scheduler",
    ]:
        assert required_text in guide


def test_backend_dependencies_include_postgresql_runtime_driver():
    pyproject = tomllib.loads((REPO_ROOT / "pyproject.toml").read_text())

    assert "psycopg[binary]>=3.2.0" in pyproject["project"]["dependencies"]
