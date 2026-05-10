# Reservation Stepper

## Purpose

Standardize the three-step reservation workflow indicator.

## Used By

Reservation time, detail, letter, verification, payment, and accepted pages.

## Variants

- Step 1 active: `Pilih Waktu`.
- Step 2 active: `Detail Kegiatan`.
- Step 3 active: `Konfirmasi`.
- Completed/all done.

## Props / Inputs

- Current step.
- Completed steps.
- Optional status variant.

## Behavior

- Visual stepper only; page routes own navigation.
- Exposes current step text for assistive tech.

## Design Decisions

- Preserve: three-step progression.
- Adapt: responsive labels and design tokens.
- Reject: absolute labels that overlap on mobile.

## Test Expectations

- Screenshots for active and completed variants.

## States

- Upcoming, active, done, all done.

## Styling Rules

- Use `secondary` for active/done.
- Stable width and mobile wrapping.

## Accessibility

- Current step indicated with text/ARIA, not color only.

## API/Data Dependencies

None.

## Open Decisions

None.
