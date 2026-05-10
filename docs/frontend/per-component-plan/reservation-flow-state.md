# Reservation Flow State

## Purpose

Standardize temporary client state shared across reservation time and detail pages.

## Used By

- `reservation-time-form.md`
- `reservation-detail-form.md`

## Variants

- Pre-submit draft.
- Created reservation context.

## Props / Inputs

- Facility id.
- Selected start/end time.
- Activity draft fields.
- Session storage adapter.

## Behavior

- Persist draft across time/detail pages and refresh when practical.
- Clear on successful reservation creation, logout, cancellation, or switching facility.
- If later step lacks required draft, redirect to earliest recoverable step.
- After reservation creation, use `reservationId` routes instead of draft routes.

## Design Decisions

- Preserve: multi-page user workflow.
- Adapt: separate route pages without losing draft state.
- Reject: indefinite draft persistence.

## Test Expectations

- Unit tests for save/restore/clear/guard behavior.

## States

- Empty, partial draft, valid time draft, created reservation.

## Styling Rules

Not visual.

## Accessibility

Navigation redirects should focus destination heading.

## API/Data Dependencies

- Uses reservation creation response id.

## Open Decisions

None.
