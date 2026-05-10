# Form Field

## Purpose

Standardize labels, helper text, input controls, validation errors, and field layout.

## Used By

Auth forms, reservation forms, catalog filters, profile display fallbacks.

## Variants

- Text.
- Email.
- Number.
- Select.
- Textarea.
- Checkbox group wrapper.

## Props / Inputs

- Label.
- Input id/name.
- Value/control props.
- Placeholder.
- Help text.
- Error text.
- Required flag.

## Behavior

- Error text appears under field and remains associated with the input.
- Field dimensions stay stable when help/error text appears where possible.

## Design Decisions

- Preserve: clear label-first form layout.
- Adapt: `DESIGN.md` typography/tokens.
- Reject: placeholder-only labels.

## Test Expectations

- Unit tests for label association, error rendering, required state, disabled state.

## States

- Default, focused, filled, disabled, error, loading options.

## Styling Rules

- Inputs use 8px radius.
- Focus uses `secondary`.
- Error uses `error`.
- Labels use compact Satoshi label style.

## Accessibility

- Inputs have labels.
- Errors use `aria-describedby` and are announced after validation.

## API/Data Dependencies

None.

## Open Decisions

None.
