# Production Readiness Checklist

Generated from the current repository docs and issue tracker on 2026-05-25.

## Scope

This checklist answers a narrow question: what is ready enough for a production-like deployment, and what still needs follow-up before treating the repo as fully production-ready.

Sources used:

- `README.md`
- `docs/backend-deployment.md`
- `docs/backend/backend-deployment.md`
- `docs/frontend/backend-gaps.md`
- `docs/issues/STATUS.md`
- `docs/issues/ISSUE-0018-deployment-readiness.md`
- `docs/issues/ISSUE-0095-production-media-asset-sourcing-follow-up.md`

## Ready

- Backend API deployment is documented for Railway.
- The production ASGI entrypoint is documented as `uvicorn app.main:create_app --factory --host 0.0.0.0 --port $PORT`.
- The health check endpoint is documented as `GET /health`.
- Production-required backend environment variables are documented.
- PostgreSQL runtime support and schema initialization guidance are documented.
- Public facility images and private reservation files are separated in the deployment guidance.
- The worker/scheduler responsibility is documented for deadline and completion jobs.
- Local bootstrap and demo seed flows are documented for smoke testing.
- Backend and frontend contract gaps are mostly resolved in the gap ledger.

## Verified Production Gaps Still Open

- Private reservation file storage is still documented as in-memory for the demo backend, so uploaded private files should not yet be treated as durable production data.
- The worker/scheduler is documented, but this repository still needs an actual production runtime for deadline, overdue verification, and completion jobs if the deployment target requires it.
- Production media asset sourcing still depends on human-provided approved assets.

## Operational Notes

- `ISSUE-0018` is marked `done`, so backend/API demo deployment readiness is considered complete at the documentation and runtime-contract level.
- The repository is therefore better described as `demo-ready` than fully `production-ready` unless durable file storage and a real worker deployment are added.
- Full production readiness for private files should be re-evaluated after durable storage is connected.

## Remaining Needs-Info Issues

- `docs/issues/ISSUE-0093-super-admin-reservations-governance-page.md` is still `needs-info`, but it is a new optional product surface rather than a core production blocker.
- `docs/issues/ISSUE-0094-super-admin-system-statistics-and-letter-template-management.md` is still `needs-info`, but it mixes optional system counters and new global template-management behavior, not a regression in the current shipped scope.
- `docs/issues/ISSUE-0095-production-media-asset-sourcing-follow-up.md` is still `needs-info` and remains relevant to production polish because it depends on human-approved assets and usage rights.

## Recommendation

1. Treat the backend/API as ready for a production-like demo deployment.
2. Do not claim full production readiness for uploaded private files until durable storage is implemented.
3. Keep the media asset follow-up separate, because it is a human-approval dependency rather than a core runtime blocker.
4. Revisit the remaining `needs-info` issues as product follow-up, but treat only durable storage, worker runtime, and approved media assets as current production-readiness concerns.
