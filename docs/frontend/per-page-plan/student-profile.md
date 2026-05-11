# Student Profile

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 20 - Profile Page.html`
- Backend: `GET /auth/me`

## Route & Access

- Proposed route: `/student/profile`
- Access: authenticated student.
- Active nav: `Profil`.

## User Goal

View account identity, NIM, phone, and academic profile information.

## Primary Flows

- Enter from profile menu or mobile bottom nav.
- Load current user/profile.
- View profile card and academic information.
- Logout clears session and redirects to login.

## UI Structure

- Student shell.
- Page header.
- Profile identity card: initials/avatar, full name, NIM, active badge, logout.
- Academic info section: NIM, phone, program study, faculty, entry year, degree/strata.

## Design Decisions

- Preserve: read-only profile card and academic info layout.
- Adapt: include MVP academic information derived from NIM by the backend.
- Reject: profile editing controls for MVP.

## Implementation Workflow

- Phase 1: design with full academic fixture.
- Phase 2: integration with `GET /auth/me`.

## Test Expectations

- Screenshots: desktop/mobile ready, missing academic data fallback.
- Integration tests: auth guard, load current user, logout, missing field handling.

## States

- Loading: profile skeleton.
- Empty: missing academic fields show fallback.
- Ready: profile visible.
- API error: retryable.
- Unauthorized/expired: auth/session.
- Success/submitted: logout.
- Unsaved changes: not applicable.

## Data & API Integration

- `GET /auth/me`.
- Student response fields: `nim`, `phone`, and nested `academic_profile`.
- `academic_profile` fields: `program_studi`, `faculty`, `entry_year`, `degree`.
- Unknown or unparsable NIM values keep the page load successful and expose null academic fields.
- Backend owns academic profile derivation from NIM.

## Backend Gaps

None identified.

## Validation & Errors

- Network/current-user error -> retry or expired-session flow.

## Copy & Language

- Document title: `Profil Mahasiswa - IPB Smart Reserve Hub`
- Heading: `Profil Mahasiswa`
- Logout CTA: `Keluar`
- Section: `Informasi Akademik`

## Responsive Behavior

- Desktop: sidebar profile card and main info section.
- Mobile: stacked profile card and info section.

## Accessibility

- One `h1`.
- Logout button has clear accessible label.
- Info fields use label/value structure.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/button.md`
- `../per-component-plan/loading-empty-error-states.md`

## Open Decisions

None.
