# Reservation Details Accepted

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 11 - Reservation Details (ACCEPTED).html`

## Route & Access

- Proposed route: `/student/reservations/:reservationId`
- Page state: accepted/approved reservation.
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Inspect approved reservation details, documents, and request cancellation if needed.

## Primary Flows

- Load approved reservation.
- View facility images and schedule/organization summary.
- View document/payment hub metadata when available.
- Click `Ajukan Pembatalan`, provide reason, submit cancellation request.

## UI Structure

- Student shell.
- Back link and cancellation request CTA.
- Facility title/gallery.
- Schedule and organization info cards.
- Document hub.

## Design Decisions

- Preserve: detail card, gallery, document hub.
- Adapt: cancellation request with reason instead of immediate cancel.
- Reject: destructive action without confirmation/reason.

## Implementation Workflow

- Phase 1: design fixture.
- Phase 2: integration TDD for detail load and cancellation request.

## Test Expectations

- Screenshots: desktop/mobile, document hub, cancellation dialog.
- Integration tests: status routing, cancellation request payload, reason required, backend error mapping.

## States

- Loading: detail skeleton.
- Ready: approved detail.
- API error: retryable.
- Success/submitted: cancellation requested state.
- Unauthorized/expired: auth/session.
- Unsaved changes: active inside cancellation dialog.

## Data & API Integration

- `GET /student/reservations/:reservationId`.
- `POST /student/reservations/:reservationId/cancellation-request`.
- Facility gallery may require detail facility data if reservation response remains minimal.

## Backend Gaps

- Blocking for integration: reservation detail response does not expose signed approval letter metadata.
- Blocking for integration: reservation detail response does not expose payment receipt metadata for paid reservations.
- Nice-to-have: student-facing view/download support for uploaded documents/receipts.

## Validation & Errors

- Cancellation reason required.
- Backend owns whether cancellation request is allowed.

## Copy & Language

- Document title: `Detail Reservasi - IPB Smart Reserve Hub`
- CTA: `Ajukan Pembatalan`
- Document hub: `Dokumen Reservasi`

## Responsive Behavior

- Desktop gallery grid; mobile collapsed gallery.
- Dialog usable on mobile.

## Accessibility

- One `h1` with facility name.
- Dialog focus trapped.
- Document rows have accessible file/action labels.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/facility-gallery.md`
- `../per-component-plan/reservation-document-hub.md`
- `../per-component-plan/confirmation-dialog.md`

## Open Decisions

None.
