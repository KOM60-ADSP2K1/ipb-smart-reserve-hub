# Per-Component Plans

This directory stores shared visual component plans and shared frontend behavior/architecture plans.

## Component Rule

Create component plans for:

- Components shared by two or more pages.
- Components used repeatedly within one page.
- Complex feature components with meaningful behavior, even if currently used by one page.
- Shared frontend behavior modules such as auth session and reservation flow state.

Do not create plans for tiny layout fragments unless they carry shared behavior or strict visual rules.

## Source Precedence

Use this precedence when sources disagree:

1. Explicit decisions in the per-page/per-component plan.
2. `docs/frontend/DESIGN.md`.
3. HTML reference files in `docs/frontend/html-reference/`.
4. Existing implementation patterns once frontend code exists.

## Design And Testing

- Component plans should define reusable visual/behavior rules so individual page implementations do not create near-duplicates.
- Use component-local states only.
- Include screenshot expectations when a component has meaningful visual variants or states.
- Generated component files should contain concrete decisions, `None identified.`, or `To decide:` items; generic instructions belong only in `component-template.md`.

## Initial Component Inventory

| Priority | Plan | Status | Notes |
| --- | --- | --- | --- |
| P0 | `auth-layout.md` | Planned | Login/register layout. |
| P0 | `auth-session.md` | Planned | Token/session/guards/redirects. |
| P0 | `student-app-shell.md` | Planned | Student nav, shell, footer, global facility search. |
| P0 | `button.md` | Planned | Shared button variants. |
| P0 | `form-field.md` | Planned | Labels, help text, field errors. |
| P0 | `password-field.md` | Planned | Show/hide password behavior. |
| P0 | `confirmation-dialog.md` | Planned | Destructive/workflow-changing actions. |
| P0 | `loading-empty-error-states.md` | Planned | Shared page state patterns. |
| P0 | `facility-image.md` | Planned | API image/fallback/aspect ratio behavior. |
| P0 | `facility-card.md` | Planned | Catalog/home facility cards. |
| P0 | `facility-filter-bar.md` | Planned | Catalog filters and URL sync. |
| P0 | `facility-gallery.md` | Planned | Facility/detail image gallery. |
| P0 | `reservation-stepper.md` | Planned | Reservation flow progress. |
| P0 | `reservation-summary-card.md` | Planned | Facility/time/payment summary sidebar/card. |
| P0 | `reservation-flow-state.md` | Planned | Draft flow state and guards. |
| P0 | `reservation-card.md` | Planned | Reservation list cards. |
| P0 | `reservation-status-badge.md` | Planned | Backend status to Indonesian labels. |
| P0 | `reservation-document-hub.md` | Planned | Submitted document/payment rows. |
| P0 | `file-upload-panel.md` | Planned | Signed letter and payment receipt upload variants. |
| P0 | `payment-instructions.md` | Planned | Amount/instructions/deadline panel. |
| P0 | `rating-input.md` | Planned | Accessible star rating input. |

## Related Docs

- Stack conventions: `../frontend-stack.md`.
- Backend gaps index: `../backend-gaps.md`.
- Component template: `component-template.md`.
