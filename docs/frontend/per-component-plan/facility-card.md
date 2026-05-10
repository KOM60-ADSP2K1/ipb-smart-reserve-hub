# Facility Card

## Purpose

Standardize facility cards in home featured facilities and catalog results.

## Used By

- `student-home.md`
- `facility-catalog.md`

## Variants

- Featured card.
- Catalog card.

## Props / Inputs

- Facility id, name, category, location, capacity, price summary, rating average, review count, cover image.

## Behavior

- Card navigates to facility details.
- Entire card may be clickable while preserving accessible link semantics.

## Design Decisions

- Preserve: image, category badge, rating, description/meta, price/capacity footer.
- Adapt: deterministic image fallback.
- Reject: cards without clear destination.

## Test Expectations

- Screenshot tests for normal, free/paid, missing image, long text.

## States

- Ready, image fallback, loading skeleton.

## Styling Rules

- Surface `surface-container-lowest`.
- 8-12px radius depending on design-system card rule.
- Stable dimensions to avoid grid shift.

## Accessibility

- Facility name is link text.
- Rating/count exposed as text.

## API/Data Dependencies

- Facility catalog/featured item shape.

## Open Decisions

None.
