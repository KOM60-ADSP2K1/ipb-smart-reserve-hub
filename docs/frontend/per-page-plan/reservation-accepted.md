# Reservation Accepted

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 08 - Reservation Accepted.html`

## Route & Access

- Proposed route: `/student/reservations/:reservationId/accepted`
- Access: authenticated student.
- Active nav: `Reservasi`.
- Transient confirmation page for actual `approved` status.

## User Goal

See confirmation that the reservation is approved and continue to details or list.

## Primary Flows

- Enter after backend status reaches `approved`.
- Show approved summary.
- Primary CTA to reservation details.
- Secondary CTA to reservation list.
- If reservation is not `approved`, redirect to status-appropriate page.

## UI Structure

- Student shell.
- Completed stepper.
- Centered success summary card.
- CTAs.

## Design Decisions

- Preserve: success card and completed stepper.
- Adapt: treat as transient confirmation, not persistent detail.
- Reject: showing before staff approval/payment approval.

## Implementation Workflow

- Phase 1: design fixture.
- Phase 2: integration TDD for approved-state routing.

## Test Expectations

- Screenshots: desktop/mobile success.
- Integration tests: loads approved reservation, redirects if wrong status, CTA routes.

## States

- Loading: summary skeleton.
- Ready: approved confirmation.
- API error: retryable.
- Unauthorized/expired: auth/session.
- Other states: not applicable.

## Data & API Integration

- `GET /student/reservations/:reservationId`.
- Show only when `status === "approved"`.

## Backend Gaps

- Nice-to-have: student-facing event/notification semantics to decide when to show one-time accepted confirmation.

## Validation & Errors

- Wrong status redirects to reservation detail/status route.

## Copy & Language

- Document title: `Reservasi Disetujui - IPB Smart Reserve Hub`
- Heading: `Reservasi Disetujui`
- Primary CTA: `Lihat Detail Reservasi`
- Secondary CTA: `Kembali ke Daftar Reservasi`

## Responsive Behavior

- Centered desktop card; full-width mobile card.

## Accessibility

- Success announced via status text.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/reservation-summary-card.md`

## Open Decisions

None.
