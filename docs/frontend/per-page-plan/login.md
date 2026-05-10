# Login

## Source References

- HTML reference: `docs/frontend/html-reference/Login.html`
- Design system: `docs/frontend/DESIGN.md`
- Stack conventions: `docs/frontend/frontend-stack.md`
- Shared components:
  - `../per-component-plan/auth-layout.md`
  - `../per-component-plan/auth-session.md`

Notes:

- HTML reference uses Inter/Playfair and English copy; implementation should use Satoshi from `DESIGN.md` and Indonesian copy.
- HTML reference uses a remote Unsplash image; implementation should use deterministic local/auth fixture imagery for screenshot tests.

## Route & Access

- Proposed route: `/login`
- Access: public only.
- Query params:
  - `redirect`: safe internal route to navigate after login.
  - `registered=1`: show post-registration success message.
  - `expired=1`: show expired-session message.
- Guard: `RequirePublic`.
- Authenticated users redirect by role:
  - Student: `/student`
  - Staff: `/staff`
  - Super Admin: `/admin`

## User Goal

Log in with an institutional account and enter the correct role shell or originally requested safe route.

## Primary Flows

- Entry points:
  - Direct visit to `/login`.
  - Redirect from protected student page as `/login?redirect=<currentPath>`.
  - Redirect from registration success as `/login?registered=1&redirect=<safeStudentPath>`.
  - Redirect after session expiry as `/login?expired=1&redirect=<currentPath>`.
- Main path:
  - User enters institutional email and password.
  - Frontend validates required fields, email shape, and institutional domain.
  - Submit calls `POST /auth/login`.
  - Store returned token through `auth-session.md`.
  - Load current user through `GET /auth/me`.
  - Navigate to safe redirect if valid for the role; otherwise navigate to role shell.
- Exit points:
  - Successful login redirects immediately.
  - Register cross-link goes to `/register`, preserving a safe student redirect if present.
- Unsaved changes:
  - Not applicable; login has no meaningful unsaved work beyond simple credentials.

## UI Structure

- Auth layout with shared two-panel desktop composition and mobile form-first composition.
- Form panel:
  - Compact `IPB SRH` mark.
  - Page heading.
  - Optional page-level message area.
  - Email field.
  - Password field with show/hide toggle.
  - Primary submit button.
  - Register cross-link.

## Design Decisions

- Preserve:
  - Split desktop auth composition from the HTML reference.
  - Strong brand presence.
- Adapt:
  - Use Indonesian copy.
  - Use Satoshi and `DESIGN.md` tokens.
  - Use shared `auth-layout.md`.
  - Use shared `auth-session.md` for token, redirects, and guards.
  - Use shared password field behavior for show/hide.
  - Enforce institutional login domains on the frontend: `apps.ipb.ac.id` and `ipb.ac.id`.
- Reject:
  - Remember-me checkbox.
  - Forgot-password link for MVP.
  - Social login.
  - English copy from the HTML reference.
  - Remote image dependency in screenshots.
- Token mapping:
  - Page background: `background` / `surface`.
  - Form panel: `surface-container-lowest`.
  - Primary CTA: `secondary`.
  - Text: `on-surface`.
  - Error message: `error-container` / `on-error-container`.

## Implementation Workflow

- Phase 1: Design implementation.
  - Build static/responsive UI from the reference and design system.
  - Use screenshot tests for desktop and mobile viewports.
  - Use deterministic fixtures/mocks only.
  - Do not wire backend integration beyond local fixtures/mocks.
- Phase 2: Integration implementation.
  - Replace fixtures with API calls.
  - Use TDD for login submission, auth redirects, validation, and error mapping.
  - Preserve screenshot coverage from Phase 1.

## Test Expectations

- Design screenshot tests:
  - Desktop: `1440 x 900`.
  - Mobile: `390 x 844`.
  - Additional visually distinct states:
    - Default form.
    - Form-level invalid credentials error.
    - Expired-session warning.
    - Registered success message.
- Design fixtures:
  - Use deterministic local auth image.
  - Use fixed message text.
- Integration TDD tests:
  - Validates required email and password.
  - Validates email shape.
  - Rejects non-institutional email domains.
  - Allows `apps.ipb.ac.id` and `ipb.ac.id`.
  - Maps invalid credentials to a form-level error.
  - Maps inactive account to a form-level error.
  - Stores token after successful login.
  - Loads current user with `GET /auth/me`.
  - Redirects to safe student redirect when present.
  - Rejects unsafe/external redirect params.
  - Redirects by role when no redirect is present.
  - Shows `registered=1` success message.
  - Shows `expired=1` warning message.

## States

- Loading:
  - Submit button shows pending state and fields remain visible.
- Empty:
  - Not applicable.
- Ready:
  - Email and password fields are editable.
- Validation error:
  - Field-level errors for required email, invalid email, disallowed email domain, and required password.
- API error:
  - Form-level error for invalid credentials, inactive account, and network failure.
- Unauthorized/expired session:
  - `expired=1` shows warning message: `Sesi Anda berakhir. Silakan masuk kembali.`
- Success/submitted:
  - Login success redirects immediately.
  - `registered=1` shows success message from prior registration.
- Unsaved changes:
  - Not applicable.

## Data & API Integration

- Submit credentials with `POST /auth/login`.
- Successful response fields:
  - `access_token`
  - `token_type`
- After token storage, load current user with `GET /auth/me`.
- Client-owned state:
  - Email input.
  - Password input.
  - Password visibility.
  - Submit pending state.
  - Page-level message from query params.
- Server-owned state:
  - Credential validity.
  - Account active status.
  - Role resolution.
- Domain ownership:
  - Backend owns credential validation and role resolution.
  - Frontend only enforces institutional email domain guardrails before submit.

## Backend Gaps

- Nice-to-have: Public auth/config endpoint exposing allowed login email domains and registration student domains.
- Nice-to-have: Auth token response does not include expiry metadata needed for proactive refresh UX.
- Nice-to-have: Password reset / forgot-password workflow is not available.

## Validation & Errors

- Frontend validation:
  - Email is required.
  - Email must be email-shaped.
  - Email must end with `apps.ipb.ac.id` or `ipb.ac.id`.
  - Password is required.
- Backend error mapping:
  - `401 Email atau password salah.` -> form-level error.
  - `401 Akun tidak aktif.` -> form-level error.
  - Network error -> form-level retry error.
- Error placement:
  - Invalid credentials stay form-level to avoid revealing whether email or password was wrong.
  - Frontend email/domain errors show under the email field.
  - Missing password shows under the password field.

## Copy & Language

- Language: Indonesian.
- Document title: `Masuk - IPB Smart Reserve Hub`
- Page heading: `Masuk`
- Email label: `Email institusi`
- Email placeholder: `nama@apps.ipb.ac.id`
- Password label: `Kata sandi`
- Primary CTA: `Masuk ke Akun`
- Register cross-link: `Belum punya akun? Daftar`
- Registered message: `Akun berhasil dibuat. Silakan masuk untuk melanjutkan.`
- Expired message: `Sesi Anda berakhir. Silakan masuk kembali.`

## Responsive Behavior

- Desktop:
  - Use shared two-panel auth layout.
  - Form panel keeps stable width while message states appear.
- Mobile:
  - Single-column form-first layout.
  - Brand/image treatment remains compact and does not push the form below the initial viewport.
  - Fields and button span available width without horizontal scrolling.

## Accessibility

- Page has one `h1`: `Masuk`.
- Email field uses `type="email"` and has associated label/error text.
- Password field has associated label/error text.
- Show/hide password toggle is an icon button with accessible label.
- Form-level messages are announced and associated with the form message area.
- Submit pending state is communicated without removing form context.
- After failed submit, focus moves to the form-level error or first invalid field.

## Shared Components Used

- `../per-component-plan/auth-layout.md`
- `../per-component-plan/auth-session.md`
- `../per-component-plan/form-field.md`
- `../per-component-plan/password-field.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
