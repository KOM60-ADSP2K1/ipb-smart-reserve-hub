# Reservation Payment Waiting

## Source References

- No HTML reference exists; planned from backend payment lifecycle.
- Backend: student reservation/payment endpoints.

## Route & Access

- Proposed route: `/student/reservations/:reservationId/payment/waiting`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Confirm that payment proof was uploaded and is waiting for staff verification.

## Primary Flows

- Enter immediately after successful payment receipt upload.
- Load reservation summary.
- Show waiting status and next step.
- Primary CTA to reservation list.
- Secondary CTA to reservation detail.

## UI Structure

- Student shell.
- Status summary card.
- Payment receipt waiting message.
- CTAs.

## Design Decisions

- Preserve: visual language from verification waiting page.
- Adapt: payment-specific copy and receipt metadata from the reservation payment projection.
- Reject: re-upload controls; payment rejected has a separate terminal page.

## Implementation Workflow

- Phase 1: design with waiting fixture.
- Phase 2: integration with student reservation payment projection.

## Test Expectations

- Screenshots: desktop/mobile waiting.
- Integration tests: route after upload, status routing, CTA navigation.

## States

- Loading: summary skeleton.
- Empty: not applicable.
- Ready: waiting.
- Validation error: invalid id.
- API error: retryable.
- Unauthorized/expired session: auth/session.
- Success/submitted: not applicable.
- Unsaved changes: not applicable.

## Data & API Integration

- State source: `GET /student/reservations/:reservationId`.
- Show when `payment.receipt` is present and `payment.review_status` is waiting/pending.
- Display receipt metadata from `payment.receipt`.

## Backend Gaps

None identified.

## Validation & Errors

- Wrong state redirects to payment upload, payment declined, accepted, or reservation detail as appropriate.

## Copy & Language

- Document title: `Menunggu Verifikasi Pembayaran - IPB Smart Reserve Hub`
- Heading: `Menunggu Verifikasi Pembayaran`
- Primary CTA: `Kembali ke Daftar Reservasi`

## Responsive Behavior

- Centered card desktop; full-width mobile.

## Accessibility

- Waiting status announced.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-summary-card.md`

## Open Decisions

None.
