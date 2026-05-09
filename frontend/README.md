# IPB Smart Reserve Hub Frontend

Frontend application for IPB Smart Reserve Hub. This package is intentionally scaffolded as a technical foundation only; product pages are planned in `../docs/frontend/per-page-plan/` and should be implemented in later design or integration slices.

## Stack

- Vite, React, and TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Vitest, React Testing Library, and MSW
- Playwright
- lucide-react
- date-fns and date-fns-tz

## Scripts

- `npm run dev`: start the Vite dev server.
- `npm run build`: typecheck and build the app.
- `npm run typecheck`: run TypeScript checks.
- `npm run lint`: run ESLint.
- `npm run test`: run Vitest behavior tests once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:e2e`: run Playwright browser tests.

## Environment

Copy `.env.example` to `.env.local` when local overrides are needed.

```env
VITE_API_BASE_URL=http://localhost:8000
```

The API client falls back to `http://localhost:8000` during development, but deployments should set `VITE_API_BASE_URL` explicitly.

## Workflow Modes

Frontend work has two modes.

Design implementation is used for visual screens, layouts, route shells, and responsive behavior. Before writing visual tests or implementing a page, inspect `../docs/frontend/IPB RSH Design/`, `../docs/frontend/DESIGN.md`, `../docs/frontend/emerald_reserve_design_system_specification.md`, and the relevant page file in `../docs/frontend/per-page-plan/`. Use Playwright screenshots for at least one desktop and one mobile viewport when meaningful UI exists. Do not force backend TDD onto pure design work.

Integration implementation is used when wiring UI to backend APIs, auth, route guards, mutations, loading states, empty states, error states, success states, and disabled states. Follow the repository TDD rule: write one failing behavior test through routed UI and MSW HTTP mocks, implement the smallest integration change to pass, then refactor while tests are green.

## Folder Structure

- `src/app`: application providers and bootstrap.
- `src/routes`: router definitions and route-level guards.
- `src/pages`: page-level compositions.
- `src/features`: domain workflow modules.
- `src/shared/api`: API client, errors, config, and shared API types.
- `src/shared/auth`: auth session abstraction.
- `src/shared/ui`: reusable UI primitives.
- `src/shared/lib`: small framework-agnostic helpers.
- `src/test`: test utilities and MSW setup.
- `e2e`: Playwright browser tests.

## Visual Tests

Do not create screenshot baselines for the technical placeholder. For real pages, inspect the closest screenshot references first, record them in the page plan, then add Playwright coverage for desktop and mobile viewports.

## Vercel

Use `frontend` as the Vercel root directory, `npm run build` as the build command, and `dist` as the output directory.
