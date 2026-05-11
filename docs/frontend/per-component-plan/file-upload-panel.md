# File Upload Panel

## Purpose

Standardize file selection/upload UI for signed approval letters and payment receipts.

## Used By

- `reservation-letter.md`
- `reservation-payment.md`

## Variants

- Signed approval letter: PDF/JPG/JPEG/PNG, max 5 MB.
- Payment receipt: JPG/JPEG/PNG, max 5 MB.

## Props / Inputs

- Accepted extensions/content types.
- Max size.
- Selected file.
- Upload pending/error state.
- Copy labels.

## Behavior

- Supports click-to-select.
- Drag/drop may be included if accessible.
- Shows selected file row and remove action.
- Validates type/size before upload.

## Design Decisions

- Preserve: dashed dropzone and uploaded file row.
- Adapt: exact backend file rules per variant.
- Reject: payment PDF upload.

## Test Expectations

- Screenshots for empty, drag active, file selected, invalid file, uploading.
- Unit tests for accepted type/size variants.

## States

- Empty, drag active, file selected, uploading, uploaded, invalid file, upload failed.

## Styling Rules

- Dropzone uses `secondary-container`-like soft tone.
- Error uses `error`.

## Accessibility

- Native file input remains keyboard accessible.
- Selected file changes are announced.

## API/Data Dependencies

- Signed letter upload: `POST /student/reservations/:reservationId/signed-approval-letter`.
- Payment receipt upload: `POST /student/reservations/:reservationId/payment-receipt`.

## Open Decisions

None.
