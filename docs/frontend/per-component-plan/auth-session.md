# Auth Session

## Purpose

Standardize frontend authentication behavior for token storage, current-user loading, API authorization, role-based route guards, redirects, logout, and expired-session handling.

## Used By

- `../per-page-plan/login.md`
- `../per-page-plan/register.md`
- `../per-page-plan/student-home.md`
- `../per-page-plan/facility-catalog.md`
- `../per-page-plan/facility-details.md`
- `../per-page-plan/reservation-time-form.md`
- `../per-page-plan/reservation-detail-form.md`
- `../per-page-plan/reservation-letter.md`
- `../per-page-plan/reservation-verification-waiting.md`
- `../per-page-plan/reservation-verification-declined.md`
- `../per-page-plan/reservation-payment.md`
- `../per-page-plan/reservation-payment-waiting.md`
- `../per-page-plan/reservation-payment-declined.md`
- `../per-page-plan/reservation-accepted.md`
- `../per-page-plan/student-reservations.md`
- `../per-page-plan/reservation-details-accepted.md`
- `../per-page-plan/reservation-details-completed.md`
- `../per-page-plan/reservation-review.md`
- `../per-page-plan/student-profile.md`

## Variants

- Public route guard: for `/login` and `/register`.
- Student route guard: for authenticated student pages.
- Staff route guard placeholder: future `/staff` shell.
- Super Admin route guard placeholder: future `/admin` shell.

## Props / Inputs

- API client dependency.
- Router/navigation dependency.
- Storage adapter, defaulting to `sessionStorage`.
- Current URL/path for safe redirect handling.

Suggested implementation boundary:

- `AuthProvider`
- `useAuth`
- `RequirePublic`
- `RequireStudent`
- Future `RequireStaff`
- Future `RequireAdmin`

## Behavior

- Store the bearer token in memory for active runtime use.
- Mirror the token to `sessionStorage` so reloads survive within the same browser tab/session.
- Do not use `localStorage` for MVP.
- On app startup:
  - If no token exists in memory or `sessionStorage`, treat the user as unauthenticated.
  - If a token exists, validate it with `GET /auth/me` before rendering protected routes.
  - Show an app-level loading state while validating.
  - If validation fails, clear the token and redirect to `/login`.
- Central API client:
  - Reads the current token from auth session state.
  - Adds `Authorization: Bearer <token>` for authenticated requests.
  - May add the auth header to public requests only when a token exists and the endpoint supports it.
  - On `401`, notifies auth session to clear token and redirect to login.
- Login:
  - Calls `POST /auth/login`.
  - Stores returned `access_token`.
  - Loads current user with `GET /auth/me`.
  - Redirects to a safe internal `redirect` target if valid for the user role.
  - Falls back to role shell redirect when no redirect is present.
- Registration:
  - `POST /auth/register` returns user data, not a token.
  - After successful registration, the register page shows success and links to `/login?registered=1&redirect=<safeStudentPath>`.
- Logout:
  - Clears memory token, `sessionStorage`, and current user state.
  - Redirects to `/login`.
- Expired session:
  - If an authenticated request returns `401`, clear session and redirect to `/login?expired=1&redirect=<currentPath>`.
  - Login page shows: `Sesi Anda berakhir. Silakan masuk kembali.`
- Token refresh:
  - Use reactive session handling only for MVP.
  - Do not run proactive refresh timers.

Role redirects:

- Student: `/student`
- Staff: `/staff`
- Super Admin: `/admin`

Route guards:

- `RequirePublic`
  - Used by `/login` and `/register`.
  - Redirects authenticated users by role.
- `RequireStudent`
  - Requires an authenticated current user with role `student`.
  - Redirects unauthenticated users to `/login?redirect=<currentPath>`.
  - Redirects `staff` users to `/staff`.
  - Redirects `super_admin` users to `/admin`.
- Future `RequireStaff`
  - Placeholder for staff pages.
- Future `RequireAdmin`
  - Placeholder for Super Admin pages.

Safe redirect rules:

- Accept only internal app paths.
- Reject absolute external URLs.
- Reject protocol-relative URLs.
- Reject paths that do not match the authenticated user's role.
- Preserve query params for safe student paths such as reservation entry routes.

## Design Decisions

- Preserve:
  - Backend bearer-token authentication contract.
  - Exact role names returned by the backend: `student`, `staff`, `super_admin`.
- Adapt:
  - Use memory plus `sessionStorage` for MVP token persistence.
  - Use `GET /auth/me` as the source of truth for role and active user state.
- Reject:
  - `localStorage` token persistence.
  - Proactive refresh timers for MVP.
  - Trusting route access based on the mere presence of a token.

## Test Expectations

- Interaction/unit tests:
  - Starts unauthenticated when no token exists.
  - Restores token from `sessionStorage` and validates with `GET /auth/me`.
  - Shows loading state while startup validation is pending.
  - Clears token and redirects to login when `GET /auth/me` fails.
  - Login stores token, loads current user, and redirects by role.
  - Login honors safe internal redirect for student routes.
  - Login rejects external redirect targets.
  - Register success preserves a safe redirect in the login CTA.
  - `RequirePublic` redirects authenticated users by role.
  - `RequireStudent` redirects unauthenticated users to login with current path.
  - `RequireStudent` redirects staff/admin users to role shell placeholders.
  - API client attaches bearer token to authenticated requests.
  - API client clears session on `401`.
  - Logout clears token and current user.

## States

- Unknown/loading: token exists and `GET /auth/me` is pending.
- Unauthenticated: no valid token/current user.
- Authenticated student: current user role is `student`.
- Authenticated staff: current user role is `staff`.
- Authenticated Super Admin: current user role is `super_admin`.
- Expired: request returned `401` and session has been cleared.
- Invalid redirect: redirect query param is unsafe or not valid for the role.

## Styling Rules

- This is not a visual component.
- App-level loading and expired-session messages should use shared loading/error state patterns from `loading-empty-error-states.md`.

## Accessibility

- App-level loading state must expose status text to assistive technology.
- Expired-session messaging on login must be visible and programmatically associated with the form-level message area.
- Redirects should move focus to the destination page's first meaningful heading or form heading.

## API/Data Dependencies

Current endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/refresh`, available but not proactively used in MVP.

Current `GET /auth/me` fields:

- `id`
- `email`
- `full_name`
- `role`
- `is_active`

Planned MVP student profile fields:

- `nim`
- `phone`
- `program_studi`
- `faculty`
- `entry_year`
- `degree`

Backend gaps are summarized in `../backend-gaps.md`.

## Open Decisions

None.
