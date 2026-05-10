# Page Name

## Source References

List the HTML reference, design-system docs, backend docs, and any precedence notes for this page.

## Route & Access

Specify proposed route, access rules, redirects, query params, and role behavior.

## User Goal

State the user's primary job on this page.

## Primary Flows

Describe entry points, main path, exit points, destructive actions, and unsaved-change behavior if applicable.

## UI Structure

Describe the visible layout and major sections.

## Design Decisions

- Preserve:
  - ...
- Adapt:
  - ...
- Reject:
  - ...
- Token mapping:
  - ...

## Implementation Workflow

- Phase 1: Design implementation.
  - Build static/responsive UI from the reference and design system.
  - Use screenshot tests for desktop and mobile viewports.
  - Use deterministic fixtures/mocks only.
  - Do not wire backend integration beyond local fixtures/mocks.
- Phase 2: Integration implementation.
  - Replace fixtures with API calls.
  - Use TDD for data loading, submissions, auth redirects, validation, and error mapping.
  - Preserve screenshot coverage from Phase 1.

## Test Expectations

- Design screenshot tests:
  - Desktop: `1440 x 900`.
  - Mobile: `390 x 844`.
  - Additional visually distinct states:
    - ...
- Design fixtures:
  - Include deterministic ready-state data.
  - Include long text values for overflow checks when relevant.
  - Include missing optional image/data cases when visually relevant.
  - Keep dates/times fixed.
- Integration TDD tests:
  - ...

## States

- Loading:
- Empty:
- Ready:
- Validation error:
- API error:
- Unauthorized/expired session:
- Success/submitted:
- Unsaved changes:

## Data & API Integration

List exact endpoints, key UI fields, client-owned state, server-owned state, and domain ownership notes.

## Backend Gaps

- Blocking for integration:
- Workaround:
- Nice-to-have:

## Validation & Errors

List frontend validation and backend error mapping.

## Copy & Language

List document title, page heading, primary CTA labels, important helper/error copy, and language rules.

## Responsive Behavior

Describe desktop, tablet, and mobile layout changes.

## Accessibility

Describe page-level heading, focus, keyboard, status announcements, and form/error behavior.

## Shared Components Used

Link to component plans used by this page.

## Open Decisions

List unresolved decisions, or write `None.`
