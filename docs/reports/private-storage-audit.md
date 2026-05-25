# Private Storage Audit

Generated from the current backend code on 2026-05-25.

## Scope

This audit covers private reservation file handling for:

- generated approval letters
- student-uploaded signed approval letters
- student-uploaded payment receipts

## Current Flow

### Storage abstraction

- `backend/app/storage/__init__.py` defines `PrivateStorage` with `put(key, content, content_type)` and `get(key)`.
- Current implementations:
  - `InMemoryPrivateStorage`
  - `LocalPrivateStorage`

### Runtime selection

- `backend/app/api/http_application.py` builds the runtime private storage.
- Selection behavior:
  - use `LocalPrivateStorage` when `IPB_PRIVATE_STORAGE_PATH` is set
  - use `InMemoryPrivateStorage` for SQLite in-memory databases
  - use `LocalPrivateStorage` beside the SQLite file for file-backed SQLite
  - otherwise use `LocalPrivateStorage("private-storage")`

### File-producing and file-consuming services

- Approval-letter PDF generation stores bytes through `ApprovalLetterIssuer`.
- Signed approval-letter uploads store bytes through `ReservationPrivateFileModule`.
- Payment receipt uploads store bytes through `ReservationPrivateFileModule`.
- Student and staff downloads read bytes back through the same storage abstraction.

### Database coupling

- The database stores `storage_key`, filename, content type, size, and timestamps for private files.
- The database does not store provider metadata beyond the opaque `storage_key`.

## What Is Good

- File access is already abstracted behind `PrivateStorage`, so the migration seam is clean.
- The services that need private files do not depend on filesystem details directly.
- Authorization stays in the application layer before file download, which is the right ownership boundary.
- The database already persists stable metadata and opaque storage keys, so object storage does not require a schema redesign.

## Production Risks In The Current State

- `InMemoryPrivateStorage` is non-durable and loses files on process restart.
- `LocalPrivateStorage` is only as durable as the deployment filesystem. On platforms with ephemeral disks, this is not safe for production reservation files.
- The system-status contract still reports storage as `not_configured`, so runtime health does not distinguish between demo storage and production storage.
- The storage abstraction only supports `put` and `get`, so it cannot yet express capabilities like delete, existence checks, or signed-download delegation.
- There is no explicit configuration model yet for private object storage provider, bucket, region, endpoint, or credentials.

## Minimum Migration Path

### 1. Extend settings

Add explicit private object-storage settings, for example:

- provider or mode
- bucket name
- region
- endpoint
- access key
- secret key
- optional key prefix

Keep `IPB_PRIVATE_STORAGE_PATH` as the local fallback for development.

### 2. Add a production storage adapter

Add a new `PrivateStorage` implementation for an S3-compatible backend.

Expected behavior:

- `put` uploads bytes to a private bucket or private prefix
- `get` downloads bytes by `storage_key`
- keys remain opaque to callers

This can fit without changing reservation services if the adapter preserves the current `put/get` contract.

### 3. Update runtime wiring

Replace the current `_build_private_storage` branching so that:

- local/in-memory storage remains available for tests and local development
- object storage is selected when the required production settings are present
- production validation can reject missing object-storage configuration when that mode is required

### 4. Improve system status

Teach `SystemStatusModule` to report storage more honestly:

- `ok` when object storage is configured and reachable enough for a cheap readiness check
- `not_configured` only for demo/local setups
- `unavailable` when configured storage cannot be reached

### 5. Add migration-safe tests

Add targeted tests for:

- selecting object storage from settings
- storing and re-downloading approval letters through the new adapter contract
- storing and re-downloading signed letters and receipts through the new adapter contract
- honest system-status reporting for configured vs unavailable storage

## Recommended Non-Goals For The First Slice

- Do not redesign reservation services.
- Do not change the database schema unless provider metadata is later proven necessary.
- Do not add signed-URL handoff in the first slice unless download throughput becomes a real concern.
- Do not mix public facility image storage into the same migration slice.

## Recommended First Implementation Slice

1. Add settings for private object storage.
2. Add one S3-compatible `PrivateStorage` adapter.
3. Wire runtime selection to choose that adapter.
4. Add backend tests for storage selection and private file round-trip behavior.
5. Update system-status reporting and deployment docs.

This is the smallest change that upgrades private reservation files from demo/local storage semantics to production-safe storage semantics without reopening reservation workflow behavior.
