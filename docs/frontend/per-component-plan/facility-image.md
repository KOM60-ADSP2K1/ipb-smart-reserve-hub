# Facility Image

## Purpose

Standardize facility image rendering, fallbacks, aspect ratios, alt text, and screenshot stability.

## Used By

Home, catalog, facility details, reservation summaries, reservation details, review summaries.

## Variants

- Card image.
- Gallery image.
- Hero image.
- Summary thumbnail.

## Props / Inputs

- `src`.
- `alt`.
- Facility name/context.
- Aspect ratio variant.
- Loading priority.

## Behavior

- Uses API image when available.
- Uses deterministic local fallback when missing.
- Avoids layout shift while loading.
- Does not depend on remote placeholder URLs in screenshot tests.

## Design Decisions

- Preserve: image-led facility browsing.
- Adapt: stable local fallbacks and responsive constraints.
- Reject: broken image icons and unlabeled images.

## Test Expectations

- Screenshot tests for API image, fallback, long alt context not visible.

## States

- Loading, loaded, missing, failed.

## Styling Rules

- Fixed aspect ratios per variant.
- `object-fit: cover` unless detail view requires containment.

## Accessibility

- Alt text uses facility name and context.
- Decorative images use empty alt only when adjacent text is equivalent.

## API/Data Dependencies

- Facility image URLs from catalog/detail APIs.

## Open Decisions

None.
