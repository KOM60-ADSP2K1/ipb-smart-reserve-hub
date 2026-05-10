# Student App Shell

## Purpose

Standardize the authenticated student layout, navigation, global facility search, notification entry point, profile menu, footer behavior, route active states, and shell-level navigation guard cooperation.

## Used By

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

- Discovery/content page shell.
- Reservation workflow shell.
- Mobile shell with bottom navigation.

## Props / Inputs

- Current route/path.
- Current authenticated student user.
- Optional unread notification count.
- Optional page-provided unsaved-change guard.
- Global search visibility mode.
- Page content.

## Behavior

- Requires authenticated student access through `auth-session.md`.
- Desktop/tablet:
  - Top navigation with compact `IPB SRH` mark.
  - Primary nav links: Beranda, Fasilitas, Reservasi.
  - Optional global facility search.
  - Notification button with optional unread badge.
  - Profile/avatar menu.
- Mobile:
  - Compact top bar with brand mark and notification/profile affordances as appropriate.
  - Persistent bottom navigation: Beranda, Fasilitas, Reservasi, Profil.
  - Bottom nav remains available on reservation workflow pages unless it conflicts with fixed upload/payment actions; reserve bottom safe area for CTAs.
- Global facility search:
  - Facility-only for MVP.
  - Visible on discovery/content pages:
    - `/student`
    - `/student/facilities`
    - `/student/facilities/:facilityId`
    - `/student/reservations`
    - `/student/profile`
  - Hidden or collapsed on workflow pages:
    - Reservation time/detail/letter/verification/payment/accepted/review pages.
  - Submitting non-empty search redirects to `/student/facilities?q=<query>`.
  - Submitting empty search redirects to `/student/facilities`.
  - On mobile, search may be an icon/action that opens a compact search field.
- Notification:
  - Shell owns notification icon/button and unread badge.
  - Full notification dropdown/page is out of MVP page-planning scope.
  - Click behavior may be a placeholder until notification UX is planned.
- Profile/avatar menu:
  - Desktop menu items:
    - `Profil Saya` -> `/student/profile`
    - `Keluar` -> logout through `auth-session.md`
  - Mobile:
    - Profile is available via bottom nav.
    - Logout can live on the profile page.
- Footer:
  - Desktop footer appears on normal student pages and may appear on reservation workflow pages when it does not add awkward scroll.
  - Mobile footer can be omitted on reservation workflow pages to reduce scroll and avoid competing with bottom navigation.
  - Footer can remain on home, catalog, details, and profile pages when useful.
- Reservation workflow:
  - Reservation pages remain inside the authenticated shell.
  - Active nav is `Reservasi`.
  - Page-specific back link and stepper own local workflow context.
  - Shell navigation should not trap the user in the workflow.
- Unsaved-change guard:
  - Pages decide when unsaved changes are active.
  - Shell nav, bottom nav, profile/logout, and global search navigation must honor the page-provided guard.
  - If active, navigation triggers the shared confirmation behavior before leaving.

Active nav mapping:

- `Beranda`
  - `/student`
- `Fasilitas`
  - `/student/facilities`
  - `/student/facilities/:facilityId`
  - `/student/facilities/:facilityId/reserve/time`
  - `/student/facilities/:facilityId/reserve/details`
- `Reservasi`
  - `/student/reservations`
  - `/student/reservations/:reservationId`
  - `/student/reservations/:reservationId/letter`
  - `/student/reservations/:reservationId/verification`
  - `/student/reservations/:reservationId/payment`
  - `/student/reservations/:reservationId/payment/waiting`
  - `/student/reservations/:reservationId/payment/declined`
  - `/student/reservations/:reservationId/accepted`
  - `/student/reservations/:reservationId/review`
- `Profil`
  - `/student/profile`

## Design Decisions

- Preserve:
  - Student HTML reference top navigation pattern.
  - Notification/profile affordances.
  - Footer brand treatment where useful.
- Adapt:
  - Use `DESIGN.md` design tokens and Satoshi typography.
  - Use bottom navigation on mobile.
  - Make global nav search functional by redirecting to facility catalog query params.
  - Hide/collapse global search during reservation/review workflows.
  - Make footer page-context aware instead of mandatory everywhere.
- Reject:
  - Non-functional `href="#"` navigation.
  - Global search that does nothing.
  - Full notification UX in this MVP shell plan.
  - Mandatory mobile footer on workflow pages.

## Test Expectations

- Screenshot tests:
  - Desktop: top nav, global search visible, profile/notification affordances, page content frame.
  - Mobile: compact top bar and bottom navigation.
  - Reservation workflow shell: active `Reservasi`, global search hidden/collapsed.
- Interaction/unit tests:
  - Active nav maps correctly for each route family.
  - Global search redirects to `/student/facilities?q=<query>`.
  - Empty global search redirects to `/student/facilities`.
  - Profile menu links to profile.
  - Logout delegates to `auth-session.md`.
  - Shell navigation honors page-provided unsaved-change guard.
  - Notification badge renders only when count is present/non-zero.

## States

- Default desktop shell.
- Default mobile shell.
- Global search focused/open.
- Profile menu open.
- Notification badge visible.
- Workflow route with global search hidden/collapsed.
- Unsaved-change guard active.

## Styling Rules

- Use `surface-container-lowest` or `surface` for top navigation.
- Use `primary` or `primary-container` for strong brand surfaces when needed.
- Use `secondary` for active navigation indicators and primary interactive accents.
- Use `outline-variant` for dividers.
- Maintain stable top-nav height across pages.
- Reserve mobile bottom safe area for bottom navigation and workflow CTAs.
- Avoid horizontal overflow in mobile nav labels.

## Accessibility

- Top navigation uses semantic `nav` with accessible labels.
- Mobile bottom navigation uses semantic `nav` and exposes current page state.
- Global search has a visible label or accessible label and submits with Enter.
- Profile menu is keyboard reachable, closes on Escape, and returns focus to trigger.
- Notification button has an accessible label and unread count announcement when present.
- Active nav state is not conveyed by color alone.
- Shell skip/focus behavior should move route changes to the page's first meaningful heading.
- Unsaved-change confirmation must be keyboard accessible and focus-managed.

## API/Data Dependencies

- Current user comes from `auth-session.md`.
- Logout delegates to `auth-session.md`.
- Notification unread count depends on future notification integration.
- Global search uses no API directly; it redirects to facility catalog URL query params.

## Open Decisions

None.
