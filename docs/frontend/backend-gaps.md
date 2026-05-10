# Frontend-Discovered Backend Gaps

This file summarizes backend gaps discovered while planning frontend pages and shared components. Page and component plans keep local context; this index is the entry point for later backend grilling and implementation sessions.

Severity labels:

- Blocking for integration: design can proceed with fixtures, but real API integration cannot satisfy the planned MVP behavior yet.
- Workaround: the frontend can ship a constrained MVP, but backend support should improve later.
- Nice-to-have: not required for MVP behavior, but improves UX or maintainability.

## Auth

- Nice-to-have: `POST /auth/register` returns a user response but no access token. Registration will show success and link to login instead of auto-login.
- Nice-to-have: auth token responses do not expose expiry metadata needed for proactive refresh UX.

## Student Home

- Blocking for integration: student home needs a backend-supported featured/explorable facilities query, such as `GET /facilities/featured` or `GET /facilities?featured=true&limit=8`.
- Resolved: `GET /facility-categories` provides active public Facility Categories with stable slugs, optional icon hints, and active facility counts for home shortcuts.

## Facility Catalog

- Blocking for integration: `GET /facilities` currently returns an unpaginated list and has no documented query params for search, category, minimum capacity, sort, page, or page size.
- Resolved: public Facility Category data exposes stored slugs through `GET /facility-categories` for URL filters.

## Reservation Detail Form

- Blocking for integration: reservation submission does not currently accept structured extra requirements such as AV support, logistics coordination, extra cleaning, or security personnel.

## Reservation Payment States

- Blocking for integration: student reservation responses need payment receipt/review state so the frontend can distinguish payment upload needed, payment verification waiting, and payment declined states.
- Blocking for integration: student reservation responses need payment rejection reason for the payment declined page.

## Reservation Document States

- Blocking for integration: student reservation responses need enough rejection context to distinguish document rejection from payment rejection when status is `rejected`.
- Blocking for integration: student reservation responses need signed approval letter upload metadata if the UI must distinguish uploaded/waiting states from upload-needed states.

## Reservation Details

- Blocking for integration: student reservation detail responses do not expose signed approval letter metadata for the document hub.
- Blocking for integration: student reservation detail responses do not expose payment receipt metadata for paid reservations.
- Nice-to-have: student-facing view/download support for uploaded signed approval letters and payment receipts, if students should be able to reopen submitted files.

## Student Profile

- Blocking for integration: `GET /auth/me` currently returns account fields only and does not expose NIM, phone, or academic profile fields.
- Blocking for integration: backend needs academic profile derivation from NIM for program study, faculty, entry year, and strata.
