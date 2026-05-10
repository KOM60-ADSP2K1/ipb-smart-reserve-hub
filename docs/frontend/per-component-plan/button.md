# Button

## Purpose

Standardize command buttons, links styled as buttons, icon buttons, loading states, and destructive actions.

## Used By

All auth and student page plans.

## Variants

- Primary.
- Secondary.
- Outline.
- Destructive.
- Ghost/text.
- Icon-only.
- Link-button.

## Props / Inputs

- Label or accessible label.
- Variant.
- Size.
- Disabled/loading state.
- Optional icon.
- Click/submit/navigation behavior.

## Behavior

- Loading buttons remain same size and prevent duplicate submit.
- Icon-only buttons require accessible labels and tooltips when meaning is not obvious.
- Link-buttons navigate through router and honor unsaved-change guards when shell-owned.

## Design Decisions

- Preserve: 44px minimum tap target from design system.
- Adapt: lucide icons where available.
- Reject: unlabeled icon-only controls and layout-shifting loading labels.

## Test Expectations

- Interaction/unit tests for disabled/loading/click behavior and accessible labels.

## States

- Default, hover, focus-visible, active, disabled, loading, destructive.

## Styling Rules

- 8px radius.
- Primary CTA uses `secondary`.
- Destructive uses `error` / `error-container`.
- Focus ring must be visible and not color-only.

## Accessibility

- Buttons expose accessible names.
- Loading state uses `aria-busy` or equivalent status where appropriate.

## API/Data Dependencies

None.

## Open Decisions

None.
