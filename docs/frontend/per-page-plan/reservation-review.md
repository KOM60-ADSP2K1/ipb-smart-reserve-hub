# Reservation Review

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 12 - Reservation Review Form.html`
- Backend: `POST /student/reservations/{reservation_id}/review`

## Route & Access

- Proposed route: `/student/reservations/:reservationId/review`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Submit a rating and optional comment for a completed reservation.

## Primary Flows

- Enter from completed reservation details.
- Select rating.
- Optionally write comment.
- Submit review.
- On success, redirect to `/student/reservations/:reservationId`.
- Cancel returns to completed detail.
- Unsaved changes guard active after edits.

## UI Structure

- Student shell.
- Back link.
- Review form card: rating input, optional comment textarea, cancel/submit.
- Reservation/facility summary sidebar.

## Design Decisions

- Preserve: two-column form and summary.
- Adapt: remove review title to match backend.
- Reject: review deletion/manage UI.

## Implementation Workflow

- Phase 1: design with rating/comment fixtures.
- Phase 2: integration TDD for submit and eligibility errors.

## Test Expectations

- Screenshots: ready, validation error, mobile.
- Integration tests: rating required, optional comment, submit success redirect, duplicate review error.

## States

- Loading: summary skeleton.
- Ready: form editable.
- Validation error: missing rating.
- API error: submit failure/duplicate review.
- Success/submitted: redirect to detail.
- Unsaved changes: active after edit.

## Data & API Integration

- `POST /student/reservations/:reservationId/review`.
- Request: `rating`, `comment`.
- Backend owns review eligibility and duplicate prevention.

## Backend Gaps

None identified.

## Validation & Errors

- Rating required, 1-5.
- Comment optional.
- `409 Review untuk reservasi ini sudah dikirim.` -> friendly message and link back to detail.

## Copy & Language

- Document title: `Tulis Ulasan - IPB Smart Reserve Hub`
- Heading: `Tulis Ulasan`
- Submit CTA: `Kirim Ulasan`
- Cancel CTA: `Batal`

## Responsive Behavior

- Desktop: form and summary sidebar.
- Mobile: stacked layout, actions full-width.

## Accessibility

- Rating input keyboard accessible.
- Error messages associated with fields.
- Success redirect focus handled by destination.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/rating-input.md`
- `../per-component-plan/reservation-summary-card.md`
- `../per-component-plan/form-field.md`

## Open Decisions

None.
