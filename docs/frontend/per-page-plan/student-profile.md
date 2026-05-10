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
- Adapt: include MVP academic information derived from NIM after backend support exists.
- Reject: profile editing controls for MVP.

## Implementation Workflow

- Phase 1: design with full academic fixture.
- Phase 2: integration after `GET /auth/me` exposes planned fields.

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

- Current: `GET /auth/me`.
- Planned fields: `nim`, `phone`, `program_studi`, `faculty`, `entry_year`, `degree`.
- Backend owns academic profile derivation from NIM.

## Backend Gaps

- Blocking for integration: `GET /auth/me` currently returns account fields only and does not expose NIM, phone, or academic profile fields.
- Blocking for integration: backend needs academic profile derivation from NIM.

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
