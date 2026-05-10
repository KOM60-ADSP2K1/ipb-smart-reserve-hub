# Facility Gallery

## Purpose

Standardize facility image galleries on facility and reservation detail pages.

## Used By

- `facility-details.md`
- `reservation-details-accepted.md`
- `reservation-details-completed.md`

## Variants

- Detail gallery.
- Compact reservation detail gallery.

## Props / Inputs

- Images with URL, alt text, cover flag.
- Facility name.

## Behavior

- Shows cover image prominently.
- Missing/failed images use `facility-image.md` fallback.

## Design Decisions

- Preserve: asymmetric gallery layout from references.
- Adapt: responsive collapse and stable aspect ratios.
- Reject: inaccessible image-only lightbox for MVP.

## Test Expectations

- Screenshots for multiple images, one image, missing images.

## States

- Loading, ready, missing/failed image fallback.

## Styling Rules

- Desktop grid; mobile simplified grid/stack.

## Accessibility

- Images have meaningful alt text.

## API/Data Dependencies

- Facility detail `images`.

## Open Decisions

None.
