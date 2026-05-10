# Facility Details

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 02 - Facility Details.html`
- Design system: `docs/frontend/DESIGN.md`
- Backend: `GET /facilities/{facility_id}`

## Route & Access

- Proposed route: `/student/facilities/:facilityId`
- Access: authenticated student.
- Active nav: `Fasilitas`.

## User Goal

Inspect facility details, reviews, price, capacity, images, and start a reservation.

## Primary Flows

- Enter from catalog/home card.
- Load facility detail.
- Review images, features, contact/price/open-hours, and public reviews.
- Click `Reservasi` to `/student/facilities/:facilityId/reserve/time`.
- Back returns to catalog preserving prior URL filters where possible.

## UI Structure

- Student app shell.
- Back link, title, rating/location metadata.
- Image gallery.
- Detail sections: description, capacity/category/open hours/contact.
- Review summary and review list.
- Sticky reservation/price CTA panel.

## Design Decisions

- Preserve: gallery, two-column detail/sidebar layout, review cards, reservation CTA.
- Adapt: student CTA instead of admin edit, real backend fields, deterministic image fallback.
- Reject: admin wording, placeholder/lorem text, remote placeholder images.

## Implementation Workflow

- Phase 1: design with fixture facility and review data.
- Phase 2: integration with `GET /facilities/:facilityId`.

## Test Expectations

- Screenshots: desktop/mobile ready, missing image fallback, no reviews, not found/error.
- Integration tests: auth guard, load detail, render reviews, reserve CTA route, not found handling.

## States

- Loading: gallery/detail skeleton.
- Empty: not applicable.
- Ready: facility detail shown.
- Validation error: invalid `facilityId` maps to not found.
- API error: retryable error.
- Unauthorized/expired session: auth/session.
- Success/submitted: reserve CTA navigates.
- Unsaved changes: not applicable.

## Data & API Integration

- `GET /facilities/:facilityId`.
- Uses `id`, `name`, `location`, `capacity`, `category`, `description`, `contact`, `images`, `price`, `open_hours_summary`, `review_summary`, `reviews`.
- Backend already includes public review summary and review list.

## Backend Gaps

None identified.

## Validation & Errors

- `404 Fasilitas tidak ditemukan.` -> not-found state with catalog CTA.
- Network error -> retryable state.

## Copy & Language

- Document title: `<Facility Name> - IPB Smart Reserve Hub`
- Primary CTA: `Reservasi Fasilitas`
- Back link: `Kembali ke Katalog`
- Reviews heading: `Ulasan Peminjam`

## Responsive Behavior

- Desktop: gallery grid and sticky sidebar.
- Mobile: gallery collapses, CTA panel becomes full-width section, no horizontal scroll.

## Accessibility

- One `h1` with facility name.
- Gallery images have meaningful alt text.
- Reserve CTA is keyboard reachable.
- Review list uses semantic structure.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/facility-gallery.md`
- `../per-component-plan/facility-image.md`
- `../per-component-plan/rating-input.md`
- `../per-component-plan/button.md`
- `../per-component-plan/loading-empty-error-states.md`

## Open Decisions

None.
