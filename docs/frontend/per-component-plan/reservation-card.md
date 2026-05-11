# Reservation Card

## Purpose

Standardize cards in the student reservation list.

## Used By

- `student-reservations.md`

## Variants

- Ongoing.
- History.
- Actionable cancellation.
- Read-only terminal.

## Props / Inputs

- Reservation id/code/status.
- Facility summary.
- Date/time.
- Optional secondary action.

## Behavior

- Primary action opens reservation detail/status route.
- Secondary action appears only when status supports it.

## Design Decisions

- Preserve: horizontal image/content/action card.
- Adapt: status-driven actions and Indonesian labels.
- Reject: cancel actions on terminal reservations.

## Test Expectations

- Screenshots for ongoing, pending, rejected, cancelled, mobile.

## States

- Ready, action pending, image fallback.

## Styling Rules

- Stable card height on desktop; stack on mobile.

## Accessibility

- Actions are buttons/links with explicit labels.

## API/Data Dependencies

- `GET /student/reservations`.
- Uses lifecycle `status` for primary grouping.
- Uses `document`, `payment`, and `rejection` projections to route to document/payment upload, waiting, declined, accepted, completed, or terminal detail states.

## Open Decisions

None.
