---
name: frontend-implementation
description: Implements frontend screens and flows in this React/Vite/Tailwind app through design-first screenshot testing, then API integration with the repo's tdd skill. Use when building or modifying frontend pages, components, routes, UI states, visual references, or frontend-backend flows in this repository.
---

# Frontend Implementation

## Scope

Use this skill for frontend work in IPB Smart Reserve Hub. The workflow has two phases:

1. **Design implementation:** build the UI with deterministic fixtures and prove the visual behavior with Playwright screenshots.
2. **Integration implementation:** wire the completed design to backend APIs using the repo's `tdd` skill, without redesigning the screen.

Always read `docs/frontend/frontend-stack.md` first. For visual context, inspect the docs that exist for the target slice:

- `docs/frontend/DESIGN.md` for tokens, typography, colors, spacing, radii, and component tone.
- `docs/frontend/per-page-plan/` for page-specific behavior and layout plans.
- `docs/frontend/per-component-plan/` for reusable component contracts.
- `docs/frontend/html-reference/` for layout and interaction intent.
- `docs/frontend/frontend-architecture.md`, `docs/frontend/emerald_reserve_design_system_specification.md`, or `docs/frontend/IPB RSH Design/` only if present.

Treat HTML references and screenshots as visual direction, not pixel-perfect contracts. They do not override `DESIGN.md` unless a page/component plan explicitly says so.

## Phase 1: Design Implementation

This phase is screenshot-driven. Do not use the backend `tdd` skill yet.

1. Identify the target route, page, component, states, and closest docs.
2. Define the next visible behavior as a Playwright screenshot expectation before implementation.
3. Use deterministic local fixtures, mock data, and local assets. Do not depend on remote placeholder or Unsplash URLs in screenshot baselines.
4. Implement the smallest UI slice needed for the screenshot to pass.
5. Run or add Playwright screenshot checks for desktop `1440 x 900` and mobile `390 x 844`.
6. Inspect screenshots for layout, hierarchy, typography, spacing, responsive behavior, overflow, clipping, contrast, blank media, and incoherent overlap.
7. Refactor only while screenshots stay green.

Design constraints:

- Use React, Vite, TypeScript, Tailwind CSS, React Router, and `lucide-react`.
- Use Satoshi typography from `DESIGN.md`; do not carry over Inter or Playfair from HTML references unless a later plan explicitly changes that direction.
- Keep workflow screens operational and usable, not generic marketing pages.
- Keep visible states complete where relevant: loading, empty, error, disabled, selected, pending, success, and rejected.
- Use reusable components when they match existing project patterns or remove meaningful duplication.
- Avoid backend contract changes during this phase.

## Phase 2: Integration Implementation

Start this phase only after the design is implemented and screenshot-tested. Load `.agents/skills/tdd/SKILL.md` and follow it for integration work.

Use a vertical red-green-refactor loop:

1. Define the next integration behavior through a public route, service, or user-facing interaction.
2. Write one failing Vitest/React Testing Library behavior test for routing, API loading/submission, auth guards, validation, or backend error mapping.
3. Replace fixtures with API calls using TanStack Query and the repo's typed API/client pattern.
4. Implement the smallest integration change to pass.
5. Refactor only while unit/integration tests and screenshots stay green.

Integration constraints:

- Preserve the implemented visual structure, styling, copy hierarchy, spacing, and screenshot baselines unless backend behavior exposes a required missing state.
- Use `VITE_API_BASE_URL`, defaulting to `http://localhost:8000`.
- Use React Hook Form and Zod for fast frontend required/format feedback.
- Treat backend responses as the source of truth for domain rules, including NIM parsing, reservation availability, booking windows, lifecycle permissions, and review eligibility.
- Store bearer tokens in memory and mirror to `sessionStorage`, not `localStorage`.
- Restore tokens from `sessionStorage` on startup and validate with `GET /auth/me`.
- Clear tokens on logout, `401`, or failed `GET /auth/me`.

## Verification

Before finishing frontend work:

- Run relevant Playwright screenshot tests for changed pages/states.
- Run relevant Vitest/React Testing Library tests after integration wiring.
- Run lint, typecheck, and build scripts when available.
- Start the dev server for app work and provide the local URL.
- State clearly if a required frontend package, script, or referenced doc does not exist.
