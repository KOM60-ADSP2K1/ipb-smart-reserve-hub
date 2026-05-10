# Reservation Summary Card

## Purpose

Standardize reservation summary sidebars/cards used through reservation and review flows.

## Used By

Reservation detail form, letter, payment, waiting/declined/accepted pages, review page.

## Variants

- Facility/time summary.
- Payment summary.
- Status summary.
- Review summary.

## Props / Inputs

- Facility name/image.
- Reservation code.
- Date/time.
- Price/payment fields.
- Organization/activity fields.

## Behavior

- Read-only summary.
- Missing optional data uses concise fallback.

## Design Decisions

- Preserve: compact summary blocks from mockups.
- Adapt: real backend fields and image fallback.
- Reject: lorem/placeholder summaries.

## Test Expectations

- Screenshots for long names, missing image, paid/free, mobile.

## States

- Loading, ready, missing optional data.

## Styling Rules

- Surface card, clear label/value rows, stable image ratio.

## Accessibility

- Labels and values remain associated and readable.

## API/Data Dependencies

- Reservation and facility summary fields.

## Open Decisions

None.
