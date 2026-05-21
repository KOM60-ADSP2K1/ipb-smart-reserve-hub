.PHONY: dev backend-test backend-seed backend-run frontend-dev

dev:
	./scripts/dev.sh

backend-test:
	cd backend && uv run pytest

backend-seed:
	cd backend && uv run python -m app.dev.seed

backend-run:
	cd backend && uv run uvicorn app.main:create_app --factory --reload

frontend-dev:
	cd frontend && npm run dev
