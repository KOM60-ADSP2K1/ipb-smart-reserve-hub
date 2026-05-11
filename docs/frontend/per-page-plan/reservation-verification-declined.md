# Reservation Verification Declined

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 06 - Reservation Verification (DECLINED).html`

## Route & Access

- Proposed route: `/student/reservations/:reservationId/verification`
- Page state: terminal document rejection.
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Understand that the reservation was rejected and choose the next navigation step.

## Primary Flows

- Load rejected reservation.
- Show rejection status and reason from the reservation `rejection` projection.
- Primary CTA: `Kembali ke Daftar Reservasi`.
- Secondary CTA: `Buat Reservasi Baru`.
- No resubmission or revision flow.

## UI Structure

- Student shell.
- Completed stepper.
- Status card with summary and declined message.
- Primary/secondary CTAs.

## Design Decisions

- Preserve: centered declined card.
- Adapt: terminal-rejection model; no upload correction UI.
- Reject: `Return to x page` placeholder and resubmission workflow.

## Implementation Workflow

- Phase 1: design with rejected fixture.
- Phase 2: integration TDD with reservation rejection projections.

## Test Expectations

- Screenshots: desktop/mobile declined, with and without reason.
- Integration tests: status routing, CTA navigation, no resubmit controls.

## States

- Loading: summary skeleton.
- Empty: not applicable.
- Ready: declined.
- Validation error: invalid id.
- API error: retryable.
- Unauthorized/expired session: auth/session.
- Success/submitted: not applicable.
- Unsaved changes: not applicable.

## Data & API Integration

- `GET /student/reservations/:reservationId`.
- Show when reservation is `rejected` and `rejection.source` is `document` or `unknown`.
- Show `rejection.reason` when present.

## Backend Gaps

None identified.

## Validation & Errors

- Wrong rejection context redirects to the correct rejected/payment page or reservation detail.

## Copy & Language

- Document title: `Reservasi Ditolak - IPB Smart Reserve Hub`
- Heading: `Reservasi Ditolak`
- Primary CTA: `Kembali ke Daftar Reservasi`
- Secondary CTA: `Buat Reservasi Baru`

## Responsive Behavior

- Full-width mobile card with CTAs stacked.

## Accessibility

- Rejection state uses text, not color alone.
- Focus moves to status heading.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/reservation-summary-card.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
