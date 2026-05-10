# Confirmation Dialog

## Purpose

Standardize confirmation for destructive or workflow-changing actions.

## Used By

- `student-reservations.md`
- `reservation-details-accepted.md`
- Unsaved-change navigation guards.

## Variants

- Destructive confirmation.
- Reason-required confirmation.
- Unsaved changes confirmation.

## Props / Inputs

- Title.
- Message.
- Confirm/cancel labels.
- Optional reason textarea.
- Pending state.

## Behavior

- Opens before cancellation, cancellation request, or guarded navigation.
- Reason variant requires non-empty reason before confirm.
- Confirm action shows pending state and prevents duplicate submit.

## Design Decisions

- Preserve: clear action separation.
- Adapt: destructive tone with `error` tokens.
- Reject: browser-native confirm for planned UI.

## Test Expectations

- Interaction tests for open/close, Escape, focus trap, required reason, submit pending.

## States

- Closed, open, reason empty, submitting, error.

## Styling Rules

- Modal surface `surface-container-lowest`.
- Destructive confirm uses `error`.

## Accessibility

- Focus trapped while open.
- Escape closes when safe.
- Dialog has accessible title/description.

## API/Data Dependencies

None.

## Open Decisions

None.
