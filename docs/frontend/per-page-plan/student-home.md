# Student Home

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 00 - Home.html`
- Design system: `docs/frontend/DESIGN.md`
- Stack conventions: `docs/frontend/frontend-stack.md`
- Shared components:
  - `../per-component-plan/student-app-shell.md`
  - `../per-component-plan/facility-card.md`
  - `../per-component-plan/facility-image.md`

Notes:

- HTML reference uses Inter/Playfair and placeholder/lorem copy; implementation should use Satoshi from `DESIGN.md` and real Indonesian copy.
- HTML reference uses remote placeholder imagery; implementation should use deterministic local fixture imagery for design screenshots and API images during integration.

## Route & Access

- Proposed route: `/student`
- Access: authenticated student.
- Guard: `RequireStudent`.
- Active nav: `Beranda`.
- Unauthenticated redirect: `/login?redirect=/student`.
- Staff/Super Admin redirect: role shell route from `auth-session.md`.

## User Goal

Quickly start discovering facilities by search, category/type shortcut, or featured facility card.

## Primary Flows

- Entry points:
  - Successful student login.
  - Student top/bottom navigation `Beranda`.
  - Direct visit to `/student`.
- Main path:
  - Student enters keyword/category/capacity in the hero search panel.
  - Submit redirects to `/student/facilities` with URL query params.
  - Student clicks a facility type shortcut to open filtered catalog.
  - Student clicks a featured facility card to open facility details.
- Exit points:
  - Search submit -> `/student/facilities?q=...&category=...&minCapacity=...`.
  - Facility type shortcut -> `/student/facilities?category=<slug>`.
  - `Lihat semua fasilitas` -> `/student/facilities`.
  - Facility card -> `/student/facilities/:facilityId`.
- Unsaved changes:
  - Not applicable.

## UI Structure

- Student app shell.
- Image-led functional hero:
  - Full product name: `IPB Smart Reserve Hub`.
  - Supporting copy about finding and reserving campus facilities.
  - Search panel.
- Search panel fields:
  - Keyword.
  - Facility category/type.
  - Minimum capacity.
  - Submit CTA.
- Facility type shortcuts:
  - Category icon.
  - Category name.
  - Short supporting text or count if backend later provides it.
- Featured facilities section:
  - Section title.
  - `Lihat semua fasilitas` link.
  - Facility cards.
- Footer may appear on desktop/mobile because this is a content/discovery page.

## Design Decisions

- Preserve:
  - Image-led hero from the HTML reference.
  - Search panel as the primary first-viewport interaction.
  - Facility type shortcut section.
  - Facility card showcase section.
- Adapt:
  - Make the hero functional rather than marketing-heavy.
  - Keep the next section visible below the hero on desktop and mobile.
  - Replace lorem copy with concise Indonesian copy.
  - Search redirects to facility catalog URL filters instead of filtering home content.
  - Facility type shortcuts use backend category slugs/IDs from `GET /facility-categories`.
  - Featured facilities use `GET /facilities?featured=true&limit=8`.
- Reject:
  - Passive landing-page-only hero.
  - Dashboard widgets, reservation stats, or personalized recommendations for MVP.
  - Remote image dependency in screenshots.
  - Placeholder/lorem content.
- Token mapping:
  - Page background: `background`.
  - Hero overlay/dark text surface: `primary` / `inverse-on-surface` when image contrast requires it.
  - Search panel: `surface-container-lowest`.
  - Primary CTA: `secondary`.
  - Cards: `surface-container-lowest`.
  - Text: `on-surface`.

## Implementation Workflow

- Phase 1: Design implementation.
  - Build static/responsive UI from the reference and design system.
  - Use screenshot tests for desktop and mobile viewports.
  - Use deterministic category and featured-facility fixtures.
  - Do not wire backend integration beyond local fixtures/mocks.
- Phase 2: Integration implementation.
  - Replace fixtures with API calls.
  - Use TDD for category loading, featured facility loading, search redirects, auth guard, and error states.
  - Preserve screenshot coverage from Phase 1.

## Test Expectations

- Design screenshot tests:
  - Desktop: `1440 x 900`.
  - Mobile: `390 x 844`.
  - Additional visually distinct states:
    - Ready state with category shortcuts and featured facilities.
    - Empty featured facilities state.
    - Category loading/error state if visually distinct.
- Design fixtures:
  - Use deterministic local hero image.
  - Include at least five facility categories.
  - Include at least four featured facilities.
  - Include long facility/category names for overflow checks.
  - Include missing facility image fallback case.
- Integration TDD tests:
  - Requires authenticated student access.
  - Redirects unauthenticated users to login with redirect.
  - Submits keyword search to `/student/facilities?q=<query>`.
  - Submits category search to `/student/facilities?category=<slug>`.
  - Submits capacity search to `/student/facilities?minCapacity=<value>`.
  - Combines query params when multiple filters are present.
  - Category shortcut redirects to catalog category filter.
  - Featured facility card links to facility details.
  - Shows API loading, empty, and error states.

## States

- Loading:
  - Category shortcuts and featured facilities show skeleton/loading state.
- Empty:
  - Featured facilities empty state links to full facility catalog.
  - Category empty state hides shortcuts or shows a compact unavailable state.
- Ready:
  - Hero, search panel, categories, and featured facilities are visible.
- Validation error:
  - Minimum capacity must be a positive number when provided.
- API error:
  - Category or featured facility load failure shows retryable error state without hiding hero search.
- Unauthorized/expired session:
  - Handled by `auth-session.md` and `student-app-shell.md`.
- Success/submitted:
  - Search submission navigates to catalog.
- Unsaved changes:
  - Not applicable.

## Data & API Integration

- Search panel:
  - No API call on home submit.
  - Redirects to catalog with URL query params:
    - `q`
    - `category`
    - `minCapacity`
- Category API:
  - `GET /facility-categories`.
  - UI needs:
    - `id`
    - `name`
    - `slug`
    - `icon_hint`
    - `facility_count`
- Featured facility API:
  - `GET /facilities?featured=true&limit=8`.
  - Response is the standard paginated facility envelope.
  - UI needs facility-card fields:
    - `id`
    - `name`
    - `location`
    - `capacity`
    - `category`
    - `cover_image_url`
    - `rating_average`
    - `review_count`
    - `price_summary`
- Client-owned state:
  - Search keyword.
  - Selected category.
  - Minimum capacity.
- Server-owned state:
  - Category metadata.
  - Featured facility selection/ordering.
- Domain ownership:
  - Backend owns category slugs and featured facility curation.
  - Frontend maps known category names/icon hints to icons with fallback icon.

## Backend Gaps

None identified.

## Validation & Errors

- Frontend validation:
  - Keyword is optional and trimmed.
  - Category is optional and must come from loaded category options.
  - Minimum capacity is optional and must be a positive integer when provided.
- Backend error mapping:
  - Category load failure -> category shortcut error/empty state.
  - Featured facility load failure -> featured section retry state.
  - Network error -> retryable section-level error.

## Copy & Language

- Language: Indonesian.
- Document title: `Beranda - IPB Smart Reserve Hub`
- Page heading: `IPB Smart Reserve Hub`
- Supporting copy: `Temukan fasilitas kampus, cek ketersediaan, dan mulai reservasi sesuai kebutuhan kegiatan Anda.`
- Keyword placeholder: `Nama fasilitas atau gedung`
- Category label: `Tipe fasilitas`
- Capacity label: `Kapasitas minimum`
- Search CTA: `Cari Fasilitas`
- Facility type section title: `Tipe Fasilitas`
- Featured section title: `Jelajah Fasilitas`
- View all link: `Lihat Semua Fasilitas`

## Responsive Behavior

- Desktop:
  - Image-led hero with overlaid/anchored search panel.
  - Category shortcuts use multi-column grid.
  - Featured facilities use card grid.
- Mobile:
  - Hero height is reduced so search is reachable quickly.
  - Search panel stacks fields vertically.
  - Category shortcuts use two-column or horizontal-scroll layout with stable item widths.
  - Featured facilities stack or use one-column cards.
  - Bottom navigation remains visible through `student-app-shell.md`.

## Accessibility

- Page has one `h1`: `IPB Smart Reserve Hub`.
- Hero image has decorative treatment when copy conveys the same meaning.
- Search form fields have labels and submit with Enter.
- Category shortcut buttons/links have accessible names.
- Featured facility cards expose facility names and destinations.
- Loading/empty/error sections expose status text.
- Text contrast over hero image must meet accessibility requirements.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/facility-card.md`
- `../per-component-plan/facility-image.md`
- `../per-component-plan/facility-filter-bar.md`
- `../per-component-plan/form-field.md`
- `../per-component-plan/button.md`
- `../per-component-plan/loading-empty-error-states.md`

## Open Decisions

None.
