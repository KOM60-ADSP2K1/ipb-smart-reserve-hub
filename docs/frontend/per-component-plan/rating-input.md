# Rating Input

## Purpose

Standardize accessible star rating display/input.

## Used By

- `reservation-review.md`
- Facility review display contexts as read-only stars if reused.

## Variants

- Interactive rating input.
- Read-only rating display.

## Props / Inputs

- Rating value.
- Change handler.
- Required/error state.
- Read-only flag.

## Behavior

- Interactive variant supports mouse, touch, and keyboard.
- Values are 1 through 5.
- Required validation belongs to page/form.

## Design Decisions

- Preserve: star rating visual.
- Adapt: accessible radio-group behavior.
- Reject: CSS-only inaccessible hover state.

## Test Expectations

- Unit tests for keyboard selection, labels, error association.

## States

- Empty, hovered/focused, selected, error, read-only.

## Styling Rules

- Use accessible contrast; selected star may use tertiary/amber.

## Accessibility

- Interactive rating uses radio group semantics with labels for 1-5.

## API/Data Dependencies

- Review API accepts integer `rating` 1-5.

## Open Decisions

None.
