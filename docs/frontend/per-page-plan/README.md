# Per-Page Plans

This directory stores one planning file per frontend page/state in the student and auth scope.

## Source Precedence

Use this precedence when sources disagree:

1. Explicit decisions in the per-page/per-component plan.
2. `docs/frontend/DESIGN.md`.
3. HTML reference files in `docs/frontend/html-reference/`.
4. Existing implementation patterns once frontend code exists.

HTML references provide layout and interaction intent. `DESIGN.md` wins on typography, design tokens, spacing discipline, component style, and accessibility unless a plan explicitly overrides it.

## Page Rule

- One frontend page/state gets one `.md` file.
- Different visible pages get separate files, even when they may eventually share a route.
- Status variants can share a proposed route but still get separate page plans when they will be implemented and screenshot-tested separately.
- Generated page files should contain concrete decisions, `None identified.`, or `To decide:` items; generic instructions belong only in `page-template.md`.

## Implementation Workflow

Every page follows two phases:

- Phase 1: Design implementation.
  - Build static/responsive UI from the reference and design system.
  - Use screenshot tests for the page at desktop and mobile viewports.
  - Use deterministic fixtures/mocks only.
  - Do not wire backend integration beyond local fixtures/mocks.
- Phase 2: Integration implementation.
  - Replace fixtures with API calls.
  - Use TDD for data loading, submissions, auth redirects, validation, and error mapping.
  - Preserve screenshot coverage from Phase 1.

## Screenshot Defaults

Every page plan must include screenshot expectations.

- Desktop: `1440 x 900`.
- Mobile: `390 x 844`.
- Add screenshots for visually distinct states such as empty, loading, validation error, upload selected, submitted, declined, or unauthorized.

## Route Conventions

Auth:

- `/login`
- `/register`

Student:

- `/student`
- `/student/facilities`
- `/student/facilities/:facilityId`
- `/student/facilities/:facilityId/reserve/time`
- `/student/facilities/:facilityId/reserve/details`
- `/student/reservations/:reservationId/letter`
- `/student/reservations/:reservationId/verification`
- `/student/reservations/:reservationId/payment`
- `/student/reservations/:reservationId/payment/waiting`
- `/student/reservations/:reservationId/payment/declined`
- `/student/reservations/:reservationId/accepted`
- `/student/reservations`
- `/student/reservations/:reservationId`
- `/student/reservations/:reservationId/review`
- `/student/profile`

Role shell placeholders:

- Staff: `/staff`
- Super Admin: `/admin`

## Auth Redirect Rules

- Unauthenticated users on student pages redirect to `/login`.
- Login supports safe internal `redirect` query params.
- Authenticated users on auth pages redirect by role:
  - Student: `/student`
  - Staff: `/staff`
  - Super Admin: `/admin`
- Authenticated non-students on student pages redirect to their role shell route or an access-denied state if the shell is not implemented.
- Register preserves safe student redirect targets and shows success with a login CTA, because registration does not return a token.

## Mobile Navigation

- Desktop/tablet: top navigation with logo, primary nav links, notification/profile actions, and a compact global facility search.
- Mobile: compact top bar with logo and notification/profile actions, plus bottom navigation for Student: Beranda, Fasilitas, Reservasi, Profil.
- Global shell search is facility-only for MVP and redirects to `/student/facilities?q=<query>`.
- Page-specific search/filter controls live in page content where full filtering behavior is defined.

## Initial Page Inventory

| Priority | Plan | Status | Notes |
| --- | --- | --- | --- |
| P0 | `login.md` | Planned | Auth entry and role redirects. |
| P0 | `register.md` | Planned | Student self-registration. |
| P0 | `student-home.md` | Planned | Discovery/search entry page. |
| P0 | `facility-catalog.md` | Planned | Search/filter/paginated catalog. |
| P0 | `facility-details.md` | Planned | Facility detail and reservation entry. |
| P0 | `reservation-time-form.md` | Planned | Date/time selection. |
| P0 | `reservation-detail-form.md` | Planned | Activity details and reservation creation. |
| P0 | `reservation-letter.md` | Planned | Approval letter download and signed upload. |
| P0 | `reservation-verification-waiting.md` | Planned | Waiting for document verification. |
| P0 | `reservation-verification-declined.md` | Planned | Terminal document rejection. |
| P0 | `reservation-payment.md` | Planned | Payment instructions and receipt upload. |
| P0 | `reservation-payment-waiting.md` | Planned | Waiting for payment verification. |
| P0 | `reservation-payment-declined.md` | Planned | Terminal payment rejection. |
| P0 | `reservation-accepted.md` | Planned | Transient approved confirmation. |
| P0 | `student-reservations.md` | Planned | Ongoing/history list. |
| P0 | `reservation-details-accepted.md` | Planned | Approved reservation detail. |
| P0 | `reservation-details-completed.md` | Planned | Completed reservation detail. |
| P0 | `reservation-review.md` | Planned | Submit rating/comment. |
| P0 | `student-profile.md` | Planned | Student profile and academic info. |

## Related Docs

- Stack conventions: `../frontend-stack.md`.
- Backend gaps index: `../backend-gaps.md`.
- Page template: `page-template.md`.
