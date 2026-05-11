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
- View/download action appears when the relevant metadata exists and a student download endpoint is available.

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

- Student reservation responses expose:
  - `document.approval_letter`
  - `document.signed_approval_letter`
  - `document.review_status`
  - `document.rejection_reason`
  - `payment.required`
  - `payment.receipt`
  - `payment.review_status`
  - `payment.rejection_reason`
- Metadata shape: `filename`, `content_type`, `size_bytes`, `generated_at`, `uploaded_at`.
- Student download endpoints:
  - `GET /student/reservations/:reservationId/signed-approval-letter/download`
  - `GET /student/reservations/:reservationId/payment-receipt/download`

## Open Decisions

None.
