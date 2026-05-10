# Reservation Document Hub

## Purpose

Standardize document/payment metadata rows on reservation detail pages.

## Used By

- `reservation-details-accepted.md`
- `reservation-details-completed.md`

## Variants

- Signed approval letter row.
- Payment receipt row.
- Verified/pending/rejected metadata.

## Props / Inputs

- File name.
- Content type.
- Uploaded date.
- Status.
- Optional view/download URL.

## Behavior

- Shows available document metadata.
- Hides rows when metadata is unavailable.
- View/download action only appears when backend supports it.

## Design Decisions

- Preserve: document hub visual row pattern.
- Adapt: backend-supported metadata only.
- Reject: fake document filenames/dates in integration.

## Test Expectations

- Screenshots for letter only, letter+receipt, missing metadata.

## States

- Ready, missing metadata, pending, verified, rejected.

## Styling Rules

- Neutral rows, status badge integration.

## Accessibility

- File rows have accessible labels and actions.

## API/Data Dependencies

- Requires future reservation document/payment metadata fields.

## Open Decisions

None.
