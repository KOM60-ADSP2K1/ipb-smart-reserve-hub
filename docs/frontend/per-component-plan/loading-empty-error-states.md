# Loading Empty Error States

## Purpose

Standardize page and section loading, empty, error, unauthorized, and retry states.

## Used By

All student data-loading pages.

## Variants

- Page loading.
- Section/card skeleton.
- Empty state.
- API error.
- Not found.
- Unauthorized/expired delegated to auth session.

## Props / Inputs

- Title/message.
- Optional retry action.
- Optional destination CTA.
- Density: page or section.

## Behavior

- Loading states preserve approximate layout dimensions.
- Errors expose retry when action is recoverable.
- Empty states give the next useful action.

## Design Decisions

- Preserve: calm, non-alarming empty/error UI.
- Adapt: use design tokens and concise Indonesian copy.
- Reject: spinners that cause major layout shift.

## Test Expectations

- Screenshot tests for representative loading/empty/error states.

## States

- Loading, empty, error, not found, retrying.

## Styling Rules

- Use neutral surfaces.
- Error state uses error tokens sparingly.

## Accessibility

- Loading and error states expose status text.
- Retry buttons are keyboard reachable.

## API/Data Dependencies

None.

## Open Decisions

None.
