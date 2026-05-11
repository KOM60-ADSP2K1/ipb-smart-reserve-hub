# Payment Instructions

## Purpose

Standardize payment amount, reservation code, instructions, and deadline display.

## Used By

- `reservation-payment.md`

## Variants

- Standard payment instructions.
- Payment unavailable/error.

## Props / Inputs

- Reservation code.
- Amount rupiah.
- Payment instructions.
- Upload deadline.

## Behavior

- Presents instructions before receipt upload.
- Long instructions wrap cleanly.

## Design Decisions

- Preserve: summary-card clarity.
- Adapt: add backend payment instructions missing from HTML mockup.
- Reject: upload-only payment page.

## Test Expectations

- Screenshots for long instructions, no deadline, mobile.

## States

- Loading, ready, unavailable, error.

## Styling Rules

- Amount prominent but not hero-scale.
- Instructions readable in paragraphs/list.

## Accessibility

- Amount and instructions are text content.

## API/Data Dependencies

- `GET /student/reservations/:reservationId/payment` returns `reservation_id`, `reservation_code`, `amount_rupiah`, and `payment_instructions`.
- Upload deadline comes from `payment_upload_due_at` on `GET /student/reservations/:reservationId`.

## Open Decisions

None.
