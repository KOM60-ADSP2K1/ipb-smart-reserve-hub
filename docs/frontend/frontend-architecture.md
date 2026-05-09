# Frontend Architecture

This document records durable frontend engineering decisions for IPB Smart Reserve Hub. It should stay compact and point to more specific planning docs instead of duplicating them.

## Source Material

- Visual language: `docs/frontend/DESIGN.md`
- Design-system details: `docs/frontend/emerald_reserve_design_system_specification.md`
- Screen references: `docs/frontend/IPB RSH Design/`
- Page/API planning: `docs/frontend/per-page-plan/`
- Implementation workflow: `.agents/skills/frontend-implementation/SKILL.md`

Before implementing meaningful UI or visual tests, inspect the closest screenshot references in `docs/frontend/IPB RSH Design/` and record the chosen references in the relevant per-page plan file.

## Application Location

The frontend application lives under `frontend/`.

The repository root remains the backend project root. Frontend package scripts, test configuration, browser tooling, and deployment configuration should be owned by the `frontend/` package unless a root-level integration point is explicitly needed.

## Stack

Use the stack documented by the frontend implementation skill:

- Vite React with TypeScript.
- Tailwind CSS for styling.
- React Router for route guards and navigation.
- TanStack Query for server state, caching, and mutations.
- `date-fns` and `date-fns-tz` for date/time formatting and Asia/Jakarta timezone handling.
- Vitest, React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`, jsdom, and MSW for behavior tests.
- Playwright for browser and screenshot verification.
- lucide-react for icons.

OpenAPI type generation is deferred. Start with a small hand-written typed API client and revisit generation only when the frontend surface is large enough to justify the added maintenance.

## Module Boundaries

Keep frontend modules organized around stable responsibilities rather than page-specific shortcuts:

- `app/`: application providers, router setup, and global bootstrap.
- `routes/`: route definitions and route-level loaders/guards when needed.
- `pages/`: page-level compositions.
- `features/`: workflow/domain modules such as auth, facilities, reservations, notifications, staff, and admin.
- `shared/api/`: API client, request/response helpers, backend error conversion, and shared API types.
- `shared/auth/`: auth session abstraction and token persistence.
- `shared/ui/`: reusable UI primitives.
- `shared/lib/`: small framework-agnostic helpers such as date/time formatting.
- `test/`: test utilities, MSW handlers, and browser test helpers.

UI components should call typed feature/query APIs instead of scattering `fetch` calls through pages.

## Routing

Use role-level route groups from the start:

- Public/auth: `/login`, `/register`
- Student: `/student/*`
- Staff: `/staff/*`
- Admin: `/admin/*`

Facility browsing is planned inside the student shell for the initial product flow. Public unauthenticated facility browsing can be added later if the product needs discovery before login.

Detailed planned pages live in `docs/frontend/per-page-plan/`.

## API Integration

The API client owns:

- Base URL configuration.
- JSON request/response handling.
- Auth header attachment.
- Form-data upload support for document and payment workflows.
- Conversion of backend errors into UI-consumable error objects.

Backend validation remains the source of truth for reservation rules, including booking window, open hours, blackouts, overlap checks, increments, same-day restrictions, minimum duration, and final availability.

## Auth

Store the access token in `localStorage` behind an auth session abstraction.

UI code should not read or write token storage directly. This keeps token persistence replaceable if the app later moves to httpOnly cookies or another refresh-token strategy.

Route guards should use current-user and role-shell checks rather than trusting only local token presence.

## Reservation Flow

Use separate routes for the reservation flow:

- `/student/facilities/:facilityId/reserve/time`
- `/student/facilities/:facilityId/reserve/details`
- `/student/facilities/:facilityId/reserve/confirm`

The visible stepper may include a verification/status step based on the design references. That step does not require a separate route unless a later page-specific grilling session decides the workflow needs one.

Selected reservation time is passed with URL search params:

- `startsAt`
- `endsAt`

Routes after time selection must reject missing or invalid time params and direct the student back to time selection.

## Implementation Modes

Frontend work has two different modes. Pick the mode before implementation starts because the workflow and definition of done are different.

### Design Implementation

Use this mode when building visual screens, translating screenshots into React/Tailwind UI, creating route shells, or implementing component layout and responsive behavior.

Workflow:

1. Inspect the closest screenshot references in `docs/frontend/IPB RSH Design/`.
2. Inspect `docs/frontend/DESIGN.md`, `docs/frontend/emerald_reserve_design_system_specification.md`, and the relevant file in `docs/frontend/per-page-plan/`.
3. Record or update the page's design documentation before implementation when decisions are needed.
4. Implement the page or component to match the documented visual direction, hierarchy, interaction states, and responsive behavior.
5. Use Playwright screenshots for at least one desktop and one mobile viewport when a runnable frontend exists.
6. Fix visible issues such as broken alignment, overflow, unreadable contrast, clipped controls, missing media, or text overlap.

Do not force the backend TDD workflow onto pure design implementation. A strict red-green loop tends to reward the smallest passing UI and can undercut the visual completeness expected from the design references.

Design implementation may still use tests where useful, but its primary verification is visual review against the design references plus Playwright screenshot checks.

### Integration Implementation

Use this mode when wiring UI to backend APIs, adding mutations, handling auth/route guards, or implementing loading, empty, error, success, and disabled states driven by API behavior.

Integration implementation follows the repository TDD rule:

1. Write one failing behavior test through routed UI and HTTP-level mocks.
2. Implement the smallest integration change to pass it.
3. Refactor while tests are green.

Use Vitest, React Testing Library, and MSW for behavior tests. Tests should verify observable behavior through public UI and HTTP-level mocks rather than private component internals.

Preserve the already-implemented visual structure unless the backend behavior requires a visible state. Keep backend concerns in typed API/client/query layers instead of scattering `fetch` calls through components.

## Visual Implementation

Use Tailwind CSS and a small internal component set. Initial primitives may include:

- `Button`
- `Input`
- `Select`
- `Textarea`
- `Badge`
- `Card`
- `Field`
- `PageHeader`
- route shell components

Treat screenshots as visual direction, not pixel-perfect specifications. Preserve recognizable layout, hierarchy, tone, and interaction patterns. Missing pages should be designed from the Emerald Reserve design system and the workflow requirements captured in their per-page plan files.
