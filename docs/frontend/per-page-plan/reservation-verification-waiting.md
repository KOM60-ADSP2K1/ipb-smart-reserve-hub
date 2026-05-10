# Reservation Verification Waiting

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 06 - Reservation Verification (WAITING).html`
- Backend: `GET /student/reservations/:reservationId`

## Route & Access

- Proposed route: `/student/reservations/:reservationId/verification`
- Page state: document review waiting.
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Understand that the signed approval letter has been submitted and staff verification is pending.

## Primary Flows

- Enter after signed approval letter upload.
- Load reservation summary.
- Show waiting status and expected next step.
- Primary CTA goes to reservation list.
- Secondary CTA goes to reservation details when available.

## UI Structure

- Student shell.
- Completed reservation stepper.
- Centered status/summary card.
- Waiting message.
- Navigation CTAs.

## Design Decisions

- Preserve: compact centered status card and completed stepper.
- Adapt: Indonesian waiting copy and real reservation summary.
- Reject: vague English copy.

## Implementation Workflow

- Phase 1: design with pending-document-review fixture.
- Phase 2: integration TDD with reservation status routing.

## Test Expectations

- Screenshots: desktop/mobile waiting state.
- Integration tests: auth guard, load reservation, show only for `pending_document_review`, route away for other statuses.

## States

- Loading: summary skeleton.
- Empty: not applicable.
- Ready: waiting status.
- Validation error: invalid reservation id -> not found.
- API error: retryable error.
- Unauthorized/expired session: auth/session.
- Success/submitted: not applicable.
- Unsaved changes: not applicable.

## Data & API Integration

- `GET /student/reservations/:reservationId`.
- Desired status: `pending_document_review`.
- UI needs reservation code, facility, starts/ends, document verification due date if present.

## Backend Gaps

- Blocking for integration: student reservation responses need document upload metadata if UI must distinguish uploaded/waiting states from upload-needed states.

## Validation & Errors

- `404 Reservasi tidak ditemukan.` -> not-found state.
- Wrong status -> redirect to status-appropriate page.

## Copy & Language

- Document title: `Menunggu Verifikasi - IPB Smart Reserve Hub`
- Heading: `Menunggu Verifikasi`
- Message: `Surat Anda sedang menunggu verifikasi.`
- Primary CTA: `Kembali ke Daftar Reservasi`

## Responsive Behavior

- Card centered on desktop and full-width on mobile.

## Accessibility

- Status message announced.
- CTAs have clear destinations.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/reservation-summary-card.md`

## Open Decisions

None.
