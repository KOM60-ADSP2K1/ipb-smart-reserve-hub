# Reservation Payment Declined

## Source References

- No HTML reference exists; planned from backend payment rejection lifecycle.

## Route & Access

- Proposed route: `/student/reservations/:reservationId/payment/declined`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Understand that payment verification failed and leave the terminal reservation state.

## Primary Flows

- Load rejected payment context.
- Show rejection reason if backend exposes it.
- Primary CTA: return to reservation list.
- Secondary CTA: create a new reservation.
- No receipt replacement or resubmission flow.

## UI Structure

- Student shell.
- Terminal declined status card.
- Reservation/payment summary.
- CTAs.

## Design Decisions

- Preserve: terminal rejection pattern from document declined page.
- Adapt: payment-specific copy.
- Reject: re-upload/revision workflow.

## Implementation Workflow

- Phase 1: design with declined fixture.
- Phase 2: integration after backend exposes rejection context.

## Test Expectations

- Screenshots: desktop/mobile declined, with/without reason.
- Integration tests: no re-upload UI, CTA navigation, rejection context routing.

## States

- Loading: summary skeleton.
- Ready: declined.
- API error: retryable.
- Unauthorized/expired session: auth/session.
- Other states: not applicable.

## Data & API Integration

- Desired source: student reservation response includes payment rejection reason/context.

## Backend Gaps

- Blocking for integration: student reservation response needs payment rejection reason.
- Blocking for integration: student reservation response needs enough context to distinguish payment rejection from document rejection.

## Validation & Errors

- Wrong rejection context redirects to correct state page.

## Copy & Language

- Document title: `Pembayaran Ditolak - IPB Smart Reserve Hub`
- Heading: `Pembayaran Ditolak`
- Primary CTA: `Kembali ke Daftar Reservasi`
- Secondary CTA: `Buat Reservasi Baru`

## Responsive Behavior

- CTAs stack on mobile.

## Accessibility

- Rejection state conveyed by heading/text and not color alone.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-summary-card.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
