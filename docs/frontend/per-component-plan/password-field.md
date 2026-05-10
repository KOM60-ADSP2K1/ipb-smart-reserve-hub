# Password Field

## Purpose

Standardize password and confirm-password inputs with show/hide behavior.

## Used By

- `../per-page-plan/login.md`
- `../per-page-plan/register.md`

## Variants

- Password.
- Confirm password.

## Props / Inputs

- Label.
- Value/control props.
- Error text.
- Required flag.

## Behavior

- Toggle switches between hidden and visible password text.
- Toggle does not change value, focus order, or validation state.
- Toggle is an icon button with accessible label.

## Design Decisions

- Preserve: password field with icon affordance.
- Adapt: lucide eye/eye-off icons.
- Reject: text-only cramped toggles and unlabeled icons.

## Test Expectations

- Unit tests for toggle, label/error association, and keyboard access.

## States

- Hidden, visible, focused, error, disabled.

## Styling Rules

- Same as `form-field.md`.
- Toggle remains fixed width to prevent input shift.

## Accessibility

- Toggle labels: `Tampilkan kata sandi` and `Sembunyikan kata sandi`.

## API/Data Dependencies

None.

## Open Decisions

None.
