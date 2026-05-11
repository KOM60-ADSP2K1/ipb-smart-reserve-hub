# Facility Catalog

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 01 - Facility Catalog.html`
- Design system: `docs/frontend/DESIGN.md`
- Shared components: `student-app-shell.md`, `facility-filter-bar.md`, `facility-card.md`, `facility-image.md`, `loading-empty-error-states.md`

## Route & Access

- Proposed route: `/student/facilities`
- Access: authenticated student.
- Active nav: `Fasilitas`.
- Supported frontend query params: `q`, `category`, `minCapacity`, `sort`, `page`.

## User Goal

Find, compare, filter, sort, and open facilities that match a reservation need.

## Primary Flows

- Enter from student home search, global shell search, facility type shortcut, or nav.
- Read initial filters from URL.
- Apply filters and update URL.
- Sort and paginate results.
- Open a facility card to `/student/facilities/:facilityId`.
- Empty results provide clear reset/search-again action.

## UI Structure

- Student app shell.
- Page header.
- Filter bar: keyword, category, minimum capacity, sort.
- Results metadata.
- Facility card grid.
- Pagination controls.

## Design Decisions

- Preserve: filter panel, result count, sort control, card grid, pagination.
- Adapt: filters sync to URL and desired backend params; use `DESIGN.md` tokens and Satoshi.
- Reject: purely client-side production integration fallback; placeholder imagery/copy.
- Token mapping: background `background`, filter/card surface `surface-container-lowest`, CTA/active page `secondary`, text `on-surface`.

## Implementation Workflow

- Phase 1: design implementation with deterministic paginated fixture data.
- Phase 2: integration TDD with the public facility catalog API.

## Test Expectations

- Design screenshots: desktop `1440 x 900`, mobile `390 x 844`, ready, empty, API error, long text.
- Fixtures: multiple categories, paid/free facilities, missing image fallback, enough records for pagination.
- Integration tests: auth guard, URL param hydration, filter submit, sort, pagination, card navigation, empty/error states.

## States

- Loading: skeleton filter metadata/cards.
- Empty: no results with reset filters CTA.
- Ready: filtered/paginated cards.
- Validation error: invalid capacity/page params normalize safely.
- API error: retryable error state.
- Unauthorized/expired session: handled by auth/session.
- Success/submitted: filter changes update URL/results.
- Unsaved changes: not applicable.

## Data & API Integration

- Backend API: `GET /facilities?q=&category=&min_capacity=&sort=&page=&page_size=`.
- Frontend URL/API mapping:
  - `q` -> `q`
  - `category` -> `category`
  - `minCapacity` -> `min_capacity`
  - `sort` -> `sort`
  - `page` -> `page`
- UI needs: `id`, `name`, `location`, `capacity`, `category`, `cover_image_url`, `rating_average`, `review_count`, `price_summary`, `open_hours_summary`.
- Response envelope: `items`, `page`, `page_size`, `total_items`, `total_pages`.
- Category options come from `GET /facility-categories` with `id`, `name`, `slug`, `icon_hint`, and `facility_count`.
- Backend owns filtering, sorting, pagination, category slugs, and result counts.

## Backend Gaps

None identified.

## Validation & Errors

- Keyword optional, trimmed.
- Category must match known slug when loaded.
- Minimum capacity must be positive integer.
- Invalid backend query errors show filter-level message and preserve current input.

## Copy & Language

- Document title: `Katalog Fasilitas - IPB Smart Reserve Hub`
- Heading: `Katalog Fasilitas`
- CTA: `Terapkan Filter`
- Empty title: `Fasilitas tidak ditemukan`
- Reset CTA: `Atur Ulang Filter`

## Responsive Behavior

- Desktop: full filter bar and 3-4 column grid.
- Mobile: stacked/collapsible filters, one-column cards, pagination remains tappable.

## Accessibility

- One `h1`.
- Filters are labeled form controls.
- Result count updates are announced.
- Pagination has accessible labels/current page.
- Cards expose clear destination names.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/facility-filter-bar.md`
- `../per-component-plan/facility-card.md`
- `../per-component-plan/facility-image.md`
- `../per-component-plan/loading-empty-error-states.md`

## Open Decisions

None.
