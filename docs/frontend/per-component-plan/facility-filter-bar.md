# Facility Filter Bar

## Purpose

Standardize facility catalog and home search filter controls.

## Used By

- `student-home.md`
- `facility-catalog.md`

## Variants

- Home compact search panel.
- Catalog full filter bar.

## Props / Inputs

- Keyword.
- Category options.
- Minimum capacity.
- Sort option.
- Submit/reset callbacks.

## Behavior

- Home variant redirects to catalog query params.
- Catalog variant reads/writes URL query params.
- Invalid capacity is shown as field error.

## Design Decisions

- Preserve: prominent search/filter grouping.
- Adapt: URL-synced filters and backend-backed category slugs.
- Reject: filters that only change local hidden state.

## Test Expectations

- Tests for URL hydration, submit, reset, invalid capacity.

## States

- Ready, category loading, category error, validation error.

## Styling Rules

- Surface card with 8-12px radius.
- Mobile controls stack.

## Accessibility

- Form controls labeled.
- Submit works with Enter.

## API/Data Dependencies

- Category list with stable slugs/IDs.

## Open Decisions

None.
