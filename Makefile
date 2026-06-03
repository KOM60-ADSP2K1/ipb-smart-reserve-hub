.PHONY: dev backend-test backend-reset-db backend-seed backend-catalog-seed backend-bootstrap-seed backend-run frontend-dev

dev:
	./scripts/dev.sh

LOCAL_DATABASE_URL=sqlite+pysqlite:///./ipb_smart_reserve_hub.db

backend-test:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run pytest

backend-reset-db:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run python -m app.dev.reset_db

backend-seed:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run python -m app.dev.seed

backend-catalog-seed:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run python -m app.dev.catalog_seed

backend-bootstrap-seed:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run python -m app.dev.bootstrap_seed

backend-run:
	cd backend && IPB_ENVIRONMENT=local IPB_DATABASE_URL=$(LOCAL_DATABASE_URL) uv run uvicorn app.main:create_app --factory --reload

frontend-dev:
	cd frontend && npm run dev
