# Reservation Payment

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 07 - Payment.html`
- Backend: payment endpoints.

## Route & Access

- Proposed route: `/student/reservations/:reservationId/payment`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Read payment instructions, upload proof of payment, and submit it for verification.

## Primary Flows

- Load reservation and payment instructions.
- Show amount, reservation code, payment instructions, upload deadline.
- Select receipt image.
- Submit receipt.
- On success, navigate to `/student/reservations/:reservationId/payment/waiting`.
- Unsaved changes guard active after file selection.

## UI Structure

- Student shell.
- Payment instruction panel.
- File upload panel.
- Reservation summary card.
- Upload CTA.

## Design Decisions

- Preserve: upload proof layout.
- Adapt: add visible payment amount/instructions before upload.
- Reject: PDF payment receipt upload, because backend accepts images only.

## Implementation Workflow

- Phase 1: design with payment fixture and upload states.
- Phase 2: integration TDD for load payment, upload receipt, routing.

## Test Expectations

- Screenshots: ready, selected file, invalid file, API error, mobile.
- Integration tests: load payment, validate file, upload success route, backend error mapping.

## States

- Loading: payment info skeleton.
- Empty: payment unavailable state.
- Ready: instructions and upload enabled.
- Validation error: missing/invalid/oversize file.
- API error: upload or load failure.
- Unauthorized/expired session: auth/session.
- Success/submitted: navigate to payment waiting.
- Unsaved changes: active after file selected.

## Data & API Integration

- `GET /student/reservations/:reservationId/payment`.
- `POST /student/reservations/:reservationId/payment-receipt`.
- Payment receipt accepts JPG/JPEG/PNG, max 5 MB.

## Backend Gaps

- Blocking for integration: student reservation responses need payment receipt/review state to distinguish upload needed, waiting verification, and declined states.

## Validation & Errors

- File required.
- Allowed: `.jpg`, `.jpeg`, `.png`.
- Max size: 5 MB.
- `409 Pembayaran hanya tersedia...` -> route/status mismatch state.

## Copy & Language

- Document title: `Pembayaran - IPB Smart Reserve Hub`
- Heading: `Pembayaran`
- Upload CTA: `Unggah Bukti Pembayaran`
- Waiting next copy: `Bukti pembayaran akan diverifikasi oleh pengelola fasilitas.`

## Responsive Behavior

- Desktop: instructions/upload and summary side by side.
- Mobile: stacked panels, CTA above bottom nav safe area.

## Accessibility

- Instructions are text, not image-only.
- File input has accessible name and selected-file announcement.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/payment-instructions.md`
- `../per-component-plan/file-upload-panel.md`
- `../per-component-plan/reservation-summary-card.md`

## Open Decisions

None.
