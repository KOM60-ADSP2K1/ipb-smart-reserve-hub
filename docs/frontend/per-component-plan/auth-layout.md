# Auth Layout

## Purpose

Standardize the shared public authentication layout for login and registration pages.

## Used By

- `../per-page-plan/login.md`
- `../per-page-plan/register.md`

## Variants

- Login page content.
- Register page content.

The visual panel and layout behavior stay shared. Page-specific headings, helper copy, form fields, CTAs, messages, and cross-links belong to the page plans.

## Props / Inputs

- Page heading.
- Optional supporting copy.
- Form content.
- Page-level message content.
- Cross-link content.

## Behavior

- Desktop uses a two-panel composition:
  - Visual/brand panel with campus or facility imagery.
  - Form panel with compact brand mark, page heading, form, and cross-link.
- Mobile uses a single-column form-first layout:
  - Keep a compact brand/image treatment.
  - Do not push the form below the initial mobile viewport.
- Message placement:
  - Message area sits above form fields.
  - Supports success, warning/session-expired, and error tones.
  - Page plans own message content and state.
- No footer links, legal links, or marketing sections in MVP.

Brand treatment:

- Visual/brand panel shows the full product name: `IPB Smart Reserve Hub`.
- Compact mark `IPB SRH` is available in the visual panel and form panel.
- Login and register share the same visual panel.

## Design Decisions

- Preserve:
  - Split brand/form composition from the HTML references on desktop.
  - Strong public `IPB Smart Reserve Hub` brand signal.
  - Compact `IPB SRH` mark.
- Adapt:
  - Use Satoshi typography and design tokens from `docs/frontend/DESIGN.md`.
  - Replace remote Unsplash image with deterministic local/auth fixture imagery for screenshots.
  - Use Indonesian copy supplied by page plans.
- Reject:
  - English auth copy from the HTML references.
  - Remote image dependency in tests.
  - Footer links on auth pages.
  - Terms/privacy links until actual legal pages exist.
  - Marketing-style extra sections.

## Test Expectations

- Screenshot tests:
  - Desktop: `1440 x 900`, split layout visible.
  - Mobile: `390 x 844`, single-column form-first layout visible.
  - Message slot visible with a representative warning/error state.
- Interaction/unit tests:
  - Renders provided heading, form content, message, and cross-link.
  - Does not render footer/legal links.

## States

- Default: visual panel plus form content.
- Message present: success, warning/session-expired, or error message shown above fields.
- Mobile: visual treatment collapses without displacing the form below first viewport.

## Styling Rules

- Use `background` or `surface` for the page background.
- Use `surface-container-lowest` for the form panel.
- Use `primary` / `primary-container` for dark brand surfaces when needed.
- Use `secondary` for primary interactive accents.
- Use `error` / `error-container` for error message tone.
- Buttons and inputs use 8px radius unless a page plan explicitly overrides.
- Maintain stable panel dimensions at desktop so form content changes do not shift the visual panel.
- Use deterministic local imagery with stable aspect ratio and object-fit behavior.

## Accessibility

- Layout must not duplicate the page `h1`; page plans own the single primary heading.
- Brand imagery must be decorative unless it conveys content beyond the adjacent text.
- Message slot must be programmatically associated with the form-level message area.
- Keyboard focus order follows visual order: brand skip is not required, form heading, message if present, fields, primary CTA, cross-link.
- Mobile layout must keep form controls reachable without horizontal scrolling.

## API/Data Dependencies

None.

## Open Decisions

None.
