# Register

## Source References

- HTML reference: `docs/frontend/html-reference/Register.html`
- Design system: `docs/frontend/DESIGN.md`
- Stack conventions: `docs/frontend/frontend-stack.md`
- Shared components:
  - `../per-component-plan/auth-layout.md`
  - `../per-component-plan/auth-session.md`

Notes:

- HTML reference uses Inter/Playfair and English copy; implementation should use Satoshi from `DESIGN.md` and Indonesian copy.
- HTML reference does not include phone, but backend and MVP require phone.
- HTML reference uses a remote Unsplash image; implementation should use deterministic local/auth fixture imagery for screenshot tests.

## Route & Access

- Proposed route: `/register`
- Access: public only.
- Query params:
  - `redirect`: safe student route to preserve after registration and login.
- Guard: `RequirePublic`.
- Authenticated users redirect by role:
  - Student: `/student`
  - Staff: `/staff`
  - Super Admin: `/admin`
- Redirect preservation:
  - Preserve only safe student paths.
  - Reject `/staff`, `/admin`, external URLs, and unsupported paths.

## User Goal

Create a student account with institutional identity data, then continue to login.

## Primary Flows

- Entry points:
  - Direct visit to `/register`.
  - Login cross-link from `/login`.
  - Redirect from a student-only route as `/register?redirect=<safeStudentPath>`.
- Main path:
  - User enters full name, NIM, phone, student institutional email, password, and password confirmation.
  - Frontend validates required fields, student email domain, password length, password match, and light NIM/phone format.
  - Submit calls `POST /auth/register`.
  - Page shows success state with `Masuk Sekarang` CTA.
  - CTA links to `/login?registered=1&redirect=<safeStudentPath>` when a safe redirect exists.
- Exit points:
  - Login cross-link goes to `/login`, preserving a safe student redirect if present.
  - Successful registration CTA goes to login.
- Unsaved changes:
  - Warn before leaving after the user edits fields.

## UI Structure

- Auth layout with shared two-panel desktop composition and mobile form-first composition.
- Form panel:
  - Compact `IPB SRH` mark.
  - Page heading.
  - Optional helper copy.
  - Optional page-level message area.
  - Full name field.
  - NIM field.
  - Phone field.
  - Student email field.
  - Password field with show/hide toggle.
  - Confirm password field with show/hide toggle.
  - Primary submit button.
  - Login cross-link.
- Success state:
  - Success message.
  - Primary CTA: `Masuk Sekarang`.

## Design Decisions

- Preserve:
  - Split desktop auth composition from the HTML reference.
  - Strong brand presence.
  - Register form grouping from the HTML reference.
- Adapt:
  - Use Indonesian copy.
  - Use Satoshi and `DESIGN.md` tokens.
  - Add required phone field.
  - Use shared `auth-layout.md`.
  - Use shared `auth-session.md` for public guard and redirect preservation.
  - Use shared password field behavior for show/hide.
  - Preserve safe student redirect after successful registration by passing it to login.
- Reject:
  - Auto-login after registration, because backend returns `UserResponse`, not a token.
  - Terms/privacy checkbox until actual legal pages exist.
  - English copy from the HTML reference.
  - Frontend NIM derivation.
  - Remote image dependency in screenshots.
- Token mapping:
  - Page background: `background` / `surface`.
  - Form panel: `surface-container-lowest`.
  - Primary CTA: `secondary`.
  - Text: `on-surface`.
  - Success message: `secondary-container` / `on-secondary-container`.
  - Error message: `error-container` / `on-error-container`.

## Implementation Workflow

- Phase 1: Design implementation.
  - Build static/responsive UI from the reference and design system.
  - Use screenshot tests for desktop and mobile viewports.
  - Use deterministic fixtures/mocks only.
  - Do not wire backend integration beyond local fixtures/mocks.
- Phase 2: Integration implementation.
  - Replace fixtures with API calls.
  - Use TDD for registration submission, public guard redirects, validation, and error mapping.
  - Preserve screenshot coverage from Phase 1.

## Test Expectations

- Design screenshot tests:
  - Desktop: `1440 x 900`.
  - Mobile: `390 x 844`.
  - Additional visually distinct states:
    - Default form.
    - Validation error state.
    - Successful registration state with `Masuk Sekarang` CTA.
- Design fixtures:
  - Use deterministic local auth image.
  - Use fixed message text.
  - Include long full-name value for overflow checks.
- Integration TDD tests:
  - Validates required full name, NIM, phone, email, password, and confirm password.
  - Validates student email domain `apps.ipb.ac.id`.
  - Rejects non-student institutional domains such as `ipb.ac.id` for registration.
  - Validates password minimum length of 8.
  - Validates confirm password match.
  - Applies light NIM guard without deriving academic data.
  - Applies light Indonesian phone validation.
  - Calls `POST /auth/register` with expected fields.
  - Maps invalid email domain backend error to email field.
  - Maps duplicate email backend error to email field.
  - Shows success state after successful registration.
  - Preserves safe student redirect in `Masuk Sekarang` login CTA.
  - Rejects unsafe/external redirect params.
  - Warns before leaving with unsaved changes.

## States

- Loading:
  - Submit button shows pending state and fields remain visible.
- Empty:
  - Not applicable.
- Ready:
  - All fields are editable.
- Validation error:
  - Field-level errors for required fields, invalid email, disallowed student domain, password length, password mismatch, NIM guard, and phone guard.
- API error:
  - Field-level error for duplicate email and disallowed domain.
  - Form-level error for network failure.
- Unauthorized/expired session:
  - Not applicable; page is public.
- Success/submitted:
  - Success message with `Masuk Sekarang` CTA.
- Unsaved changes:
  - Warn before leaving after the user edits any field and before successful submit.

## Data & API Integration

- Submit registration with `POST /auth/register`.
- Request fields:
  - `email`
  - `password`
  - `full_name`
  - `nim`
  - `phone`
- Successful response fields:
  - `id`
  - `email`
  - `full_name`
  - `role`
  - `is_active`
  - `nim`
  - `phone`
  - `academic_profile`
- Client-owned state:
  - Full name input.
  - NIM input.
  - Phone input.
  - Email input.
  - Password input.
  - Confirm password input.
  - Password visibility.
  - Confirm password visibility.
  - Submit pending state.
  - Registration success state.
- Server-owned state:
  - Email domain allowlist.
  - Duplicate email detection.
  - Account creation.
- Domain ownership:
  - Backend owns NIM parsing and academic profile derivation.
  - Frontend only performs required/light format guardrails.

## Backend Gaps

- Nice-to-have: registration response could return an access token if product later wants immediate login after registration.
- Nice-to-have: public auth/config endpoint exposing allowed registration student domains.
- Nice-to-have: backend could enforce stricter phone format if phone format becomes a business rule.

## Validation & Errors

- Frontend validation:
  - Full name is required.
  - NIM is required.
  - NIM is trimmed and lightly checked for reasonable format/length.
  - Phone is required.
  - Phone accepts common Indonesian formats: `08...`, `+62...`, or `62...`; spaces/dashes may be allowed while typing.
  - Email is required.
  - Email must be email-shaped.
  - Email must end with `apps.ipb.ac.id`.
  - Password is required.
  - Password minimum length is 8.
  - Confirm password is required.
  - Confirm password must match password.
- Backend error mapping:
  - `400 Email harus menggunakan domain institusi yang diizinkan.` -> email field error.
  - `409 Email sudah terdaftar.` -> email field error and keep entered values except passwords.
  - Network error -> form-level retry error.

## Copy & Language

- Language: Indonesian.
- Document title: `Daftar Akun - IPB Smart Reserve Hub`
- Page heading: `Daftar Akun`
- Full name label: `Nama lengkap`
- NIM label: `NIM`
- Phone label: `Nomor telepon`
- Email label: `Email institusi mahasiswa`
- Email placeholder: `nama@apps.ipb.ac.id`
- Password label: `Kata sandi`
- Confirm password label: `Konfirmasi kata sandi`
- Primary CTA: `Daftar`
- Login cross-link: `Sudah punya akun? Masuk`
- Success message: `Akun berhasil dibuat. Silakan masuk untuk melanjutkan.`
- Success CTA: `Masuk Sekarang`

## Responsive Behavior

- Desktop:
  - Use shared two-panel auth layout.
  - Form may use two-column grouping where comfortable, but must keep labels and errors readable.
- Mobile:
  - Single-column form-first layout.
  - All fields stack vertically.
  - Brand/image treatment remains compact and does not push the form below the initial viewport.
  - Fields and button span available width without horizontal scrolling.

## Accessibility

- Page has one `h1`: `Daftar Akun`.
- Every field has associated label and error text.
- Password and confirm password toggles are icon buttons with accessible labels.
- Required fields are communicated through labels and validation messages.
- Form-level messages are announced and associated with the form message area.
- Submit pending state is communicated without removing form context.
- After failed submit, focus moves to the first invalid field or form-level error.
- Success state moves focus to the success message heading/region.

## Shared Components Used

- `../per-component-plan/auth-layout.md`
- `../per-component-plan/auth-session.md`
- `../per-component-plan/form-field.md`
- `../per-component-plan/password-field.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
