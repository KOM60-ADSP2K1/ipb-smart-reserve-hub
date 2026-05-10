# Reservation Detail Form

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 04 - Reservation Detail Form.html`
- Design system: `docs/frontend/DESIGN.md`
- Backend: `POST /facilities/{facility_id}/reservations`, `GET /organization-units`

## Route & Access

- Proposed route: `/student/facilities/:facilityId/reserve/details`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Provide event details and create the reservation record.

## Primary Flows

- Enter after valid time selection.
- Load active organization units.
- Complete activity details and extra requirements.
- Submit reservation.
- On success, receive `reservationId` and navigate to `/student/reservations/:reservationId/letter`.
- If draft time/facility is missing, redirect to time form.
- Unsaved changes guard active after edits.

## UI Structure

- Student shell, back link, reservation stepper.
- Form card: activity title, participant count, organization unit select, contact phone, description, extra requirement checkboxes.
- Summary sidebar: facility, date/time, estimated price/policy.

## Design Decisions

- Preserve: two-column form and summary, extra requirement checkbox group.
- Adapt: organization is backend-backed select, phone is explicit contact field, submit creates reservation.
- Reject: free-text organization input.

## Implementation Workflow

- Phase 1: design with draft/facility/org fixtures.
- Phase 2: integration TDD for org loading, reservation submit, backend error mapping.

## Test Expectations

- Screenshots: desktop/mobile ready, validation errors, org loading/error.
- Integration tests: draft guard, load org units, submit payload, success navigation, conflict handling.

## States

- Loading: organization units/facility summary.
- Empty: no organization units.
- Ready: form editable.
- Validation error: required fields/invalid counts.
- API error: submit failure or conflict.
- Unauthorized/expired session: auth/session.
- Success/submitted: navigate to letter page.
- Unsaved changes: active after edits.

## Data & API Integration

- `GET /organization-units`.
- `POST /facilities/:facilityId/reservations`.
- Request fields currently supported: `activity_title`, `event_description`, `participant_count`, `organization_unit_id`, `contact_phone`, `starts_at`, `ends_at`.
- Planned MVP extra requirements: AV support, logistics coordination, extra cleaning, security personnel.
- Backend owns final availability/conflict guard.

## Backend Gaps

- Blocking for integration: reservation submission does not accept structured extra requirements required by MVP UI.

## Validation & Errors

- Required: activity title, participant count, organization unit, contact phone, description, selected draft time.
- Participant count positive integer and should not exceed facility capacity client-side.
- `409 Waktu reservasi tidak tersedia.` -> form-level conflict with return to time selection.

## Copy & Language

- Document title: `Detail Kegiatan - IPB Smart Reserve Hub`
- Heading: `Detail Kegiatan`
- CTA: `Buat Reservasi`
- Extra requirements: `Keperluan Tambahan`

## Responsive Behavior

- Desktop: form and summary sidebar.
- Mobile: summary stacks above/below form consistently; CTA visible above bottom nav.

## Accessibility

- One `h1`.
- Checkbox group has group label.
- Errors associated with fields.
- Summary is readable without relying on sidebar position.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/reservation-summary-card.md`
- `../per-component-plan/reservation-flow-state.md`
- `../per-component-plan/form-field.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
