# Reservation Status Badge

## Purpose

Map backend reservation statuses to Indonesian labels and visual badge tones.

## Used By

- `student-reservations.md`
- Reservation detail/status pages.

## Variants

- Pending/waiting.
- Approved.
- Completed.
- Cancelled.
- Rejected/expired.

## Props / Inputs

- Backend `status`.

## Behavior

- Displays Indonesian label.
- Unknown status falls back to raw value with neutral tone and logs/flags during development.

## Design Decisions

- Preserve: pill badge pattern.
- Adapt: consistent backend enum mapping.
- Reject: English labels from mockups.

## Test Expectations

- Unit tests for every backend status mapping.

## States

- Known status, unknown status.

## Styling Rules

- Pending uses tertiary/amber tone.
- Approved/completed uses secondary/green tone.
- Rejected/expired uses error tone.
- Cancelled uses neutral tone.

## Accessibility

- Badge text must be explicit; color is supplemental.

## API/Data Dependencies

Backend statuses:

- `pending_document_upload` -> `Menunggu Unggah Dokumen`
- `pending_document_review` -> `Menunggu Verifikasi Dokumen`
- `pending_payment` -> `Menunggu Pembayaran`
- `overdue_verification` -> `Verifikasi Terlambat`
- `approved` -> `Disetujui`
- `cancellation_requested` -> `Pembatalan Diajukan`
- `completed` -> `Selesai`
- `cancelled` -> `Dibatalkan`
- `rejected` -> `Ditolak`
- `expired` -> `Kedaluwarsa`

## Open Decisions

None.
