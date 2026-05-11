# Reservation Details Completed

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 11 - Reservation Details (COMPLETED).html`

## Route & Access

- Proposed route: `/student/reservations/:reservationId`
- Page state: completed reservation.
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Review completed reservation details and submit a review when eligible.

## Primary Flows

- Load completed reservation.
- Show detail/gallery/document hub.
- If `review` is null, show `Tulis Ulasan`.
- If active review exists, show `Ulasan Terkirim`.
- Review CTA navigates to `/student/reservations/:reservationId/review`.

## UI Structure

- Same detail structure as accepted page.
- Review action/status replaces cancellation action.

## Design Decisions

- Preserve: completed detail layout and Add Review action.
- Adapt: show review action only when backend indicates no active review exists.
- Reject: review delete/manage UI on this page.

## Implementation Workflow

- Phase 1: design fixtures with no review and with existing review.
- Phase 2: integration TDD for review visibility/status routing.

## Test Expectations

- Screenshots: no-review CTA, review-submitted state, mobile.
- Integration tests: load completed reservation, CTA visibility, 409 review already submitted mapping.

## States

- Loading: skeleton.
- Ready: completed detail.
- API error: retryable.
- Unauthorized/expired: auth/session.
- Other states: not applicable.

## Data & API Integration

- `GET /student/reservations/:reservationId`.
- Uses `review` field to determine review action visibility.
- Document hub uses `document.approval_letter`, `document.signed_approval_letter`, and `payment.receipt` metadata when present.
- Student download actions:
  - `GET /student/reservations/:reservationId/signed-approval-letter/download`.
  - `GET /student/reservations/:reservationId/payment-receipt/download`.

## Backend Gaps

None identified.

## Validation & Errors

- Backend owns whether review is allowed.

## Copy & Language

- Document title: `Detail Reservasi Selesai - IPB Smart Reserve Hub`
- Review CTA: `Tulis Ulasan`
- Submitted label: `Ulasan Terkirim`

## Responsive Behavior

- Same as accepted detail.

## Accessibility

- Review CTA/status is text-visible and keyboard accessible.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/facility-gallery.md`
- `../per-component-plan/reservation-document-hub.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
