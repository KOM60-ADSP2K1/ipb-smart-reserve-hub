# Reservation Letter

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 05 - Reservation Letter.html`
- Backend: approval letter endpoints.

## Route & Access

- Proposed route: `/student/reservations/:reservationId/letter`
- Access: authenticated student.
- Active nav: `Reservasi`.
- Requires existing reservation.

## User Goal

Download generated approval letter, upload the signed approval letter, and submit for verification.

## Primary Flows

- Load/generate approval letter metadata on page load.
- Download approval letter PDF.
- Select signed file.
- Submit signed file.
- On success, navigate to `/student/reservations/:reservationId/verification`.
- Back returns to detail form only before reservation creation is no longer relevant; otherwise reservation list/detail.
- Unsaved changes guard active after file selection.

## UI Structure

- Student shell, stepper, summary card.
- Template/download card.
- File upload panel.
- Uploaded/selected file row.
- Submit CTA.

## Design Decisions

- Preserve: download template + upload document two-section layout.
- Adapt: generated-first backend flow; upload disabled until letter metadata is available.
- Reject: multiple unrelated templates unless backend supports them.

## Implementation Workflow

- Phase 1: design with file states.
- Phase 2: integration TDD for generation, download, upload, errors.

## Test Expectations

- Screenshots: ready, selected file, invalid file, generation error, mobile.
- Integration tests: load metadata, download link, file validation, upload success navigation, 409 mapping.

## States

- Loading: generating/loading approval letter.
- Empty: not applicable.
- Ready: download available and upload enabled.
- Validation error: invalid file type/size or missing file.
- API error: generation/upload failure.
- Unauthorized/expired session: auth/session.
- Success/submitted: navigate to verification waiting.
- Unsaved changes: active after file selected.

## Data & API Integration

- `GET /student/reservations/:reservationId/approval-letter`.
- `GET /student/reservations/:reservationId/approval-letter/download`.
- `POST /student/reservations/:reservationId/signed-approval-letter`.
- Signed approval letter accepts PDF/JPG/JPEG/PNG, max 5 MB.

## Backend Gaps

None identified.

## Validation & Errors

- File required before submit.
- Allowed: `.pdf`, `.jpg`, `.jpeg`, `.png`.
- Max size: 5 MB.
- `409 Surat persetujuan harus dibuat sebelum unggah surat bertanda tangan.` -> retry generation and keep upload disabled.

## Copy & Language

- Document title: `Surat Persetujuan - IPB Smart Reserve Hub`
- Heading: `Surat Persetujuan`
- Download CTA: `Unduh Surat`
- Upload CTA: `Unggah Surat Bertanda Tangan`

## Responsive Behavior

- Desktop: upload area and summary sidebar.
- Mobile: stacked panels, CTA above bottom nav safe area.

## Accessibility

- File input keyboard accessible.
- Selected file announced.
- Download/upload controls have clear labels.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/file-upload-panel.md`
- `../per-component-plan/reservation-summary-card.md`

## Open Decisions

None.
