# Student Reservations

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 10 - Reservation List.html`
- Backend: `GET /student/reservations`, cancellation endpoints.

## Route & Access

- Proposed route: `/student/reservations`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

View ongoing and historical reservations, open details, and perform valid reservation actions.

## Primary Flows

- Enter from nav or status pages.
- Toggle between `Sedang Berlangsung` and `Riwayat`.
- Open reservation detail.
- Show secondary action only when status allows it.
- Pre-approval statuses use immediate cancel endpoint with confirmation.
- Approved statuses use cancellation request with reason.

## UI Structure

- Student shell.
- Page header.
- Tabs: ongoing/history.
- Reservation cards with image, title, status, location/date/time, actions.
- Empty states per tab.

## Design Decisions

- Preserve: two-tab list and card layout.
- Adapt: status-driven grouping/actions using backend enum values.
- Reject: cancel buttons on terminal statuses.

## Implementation Workflow

- Phase 1: design with mixed-status fixtures.
- Phase 2: integration TDD for list load, grouping, actions, confirmations.

## Test Expectations

- Screenshots: ongoing tab, history tab, empty tab, mobile.
- Integration tests: auth guard, status grouping, details navigation, cancel/request actions, 409 mapping.

## States

- Loading: card skeletons.
- Empty: per-tab empty state.
- Ready: grouped cards.
- API error: retryable list error.
- Unauthorized/expired: auth/session.
- Success/submitted: cancellation state updates.
- Unsaved changes: not applicable.

## Data & API Integration

- `GET /student/reservations`.
- `POST /student/reservations/:reservationId/cancel`.
- `POST /student/reservations/:reservationId/cancellation-request`.
- Ongoing statuses: `pending_document_upload`, `pending_document_review`, `pending_payment`, `overdue_verification`, `approved`, `cancellation_requested`.
- History statuses: `completed`, `rejected`, `cancelled`, `expired`.

## Backend Gaps

- Blocking for integration: payment/document substate gaps affect routing from list cards into payment waiting/declined and document/payment declined pages.

## Validation & Errors

- Backend owns whether cancellation is allowed.
- `409` action errors show state-specific message and refresh list.

## Copy & Language

- Document title: `Reservasi Saya - IPB Smart Reserve Hub`
- Heading: `Reservasi Saya`
- Tabs: `Sedang Berlangsung`, `Riwayat`
- Detail CTA: `Detail Reservasi`
- Cancel CTA: `Batalkan`
- Cancellation request CTA: `Ajukan Pembatalan`

## Responsive Behavior

- Desktop: horizontal cards with image.
- Mobile: stacked cards, actions full-width or wrapped.

## Accessibility

- Tabs use tablist semantics.
- Status badge text is readable.
- Confirmation dialog focus-managed.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-card.md`
- `../per-component-plan/reservation-status-badge.md`
- `../per-component-plan/confirmation-dialog.md`
- `../per-component-plan/loading-empty-error-states.md`

## Open Decisions

None.
