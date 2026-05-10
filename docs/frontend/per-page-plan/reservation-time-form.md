# Reservation Time Form

## Source References

- HTML reference: `docs/frontend/html-reference/Student - 03 - Reservation Time Form.html`
- Design system: `docs/frontend/DESIGN.md`
- Backend: facility calendar, availability, reservation-time-selection endpoints.

## Route & Access

- Proposed route: `/student/facilities/:facilityId/reserve/time`
- Access: authenticated student.
- Active nav: `Reservasi`.

## User Goal

Choose a valid reservation date/time before entering event details.

## Primary Flows

- Enter from facility details reserve CTA.
- Pick date, start time, and end time.
- UI checks availability as selections become complete.
- Continue performs final validation and stores draft time/facility state.
- Continue navigates to `/student/facilities/:facilityId/reserve/details`.
- Back returns to facility details.
- Unsaved time selection triggers navigation guard.

## UI Structure

- Student shell with workflow search hidden.
- Back link.
- Reservation stepper.
- Calendar/date selector.
- Time selection panel.
- Duration/availability feedback.
- Continue CTA.

## Design Decisions

- Preserve: two-column calendar + time sidebar and three-step stepper.
- Adapt: accessible/native-backed date/time behavior with custom visual shell.
- Reject: hand-rolled inaccessible calendar behavior, static-only availability.

## Implementation Workflow

- Phase 1: design with available/unavailable fixtures.
- Phase 2: integration TDD for calendar, availability, validation, draft state.

## Test Expectations

- Screenshots: desktop/mobile ready, unavailable selection, validation error.
- Integration tests: load calendar, validate time, continue only when valid, preserve draft, auth guard.

## States

- Loading: calendar availability loading.
- Empty: no selectable slots.
- Ready: selectable date/time.
- Validation error: invalid duration, unavailable slot, outside booking window.
- API error: retryable availability error.
- Unauthorized/expired session: auth/session.
- Success/submitted: draft saved and navigate to detail form.
- Unsaved changes: active after time/date edit.

## Data & API Integration

- `GET /facilities/:facilityId/calendar?start=&end=`.
- `GET /facilities/:facilityId/availability?start=&end=`.
- `POST /facilities/:facilityId/reservation-time-selection`.
- Backend owns booking window, minimum duration, open hours, blackout, and overlap rules.
- Draft state owned by `reservation-flow-state.md`.

## Backend Gaps

None identified for current validation endpoints.

## Validation & Errors

- Frontend requires date, start, and end before continue.
- Backend validation reasons map to Indonesian inline messages.
- Facility not found -> facility not-found state.

## Copy & Language

- Document title: `Pilih Waktu Reservasi - IPB Smart Reserve Hub`
- Heading/step: `Pilih Waktu`
- CTA: `Lanjutkan`
- Availability success: `Waktu tersedia`

## Responsive Behavior

- Desktop: calendar and time panel side by side.
- Mobile: stacked sections, CTA above bottom nav safe area.

## Accessibility

- Date/time controls keyboard accessible.
- Availability changes announced.
- Stepper exposes current step text.

## Shared Components Used

- `../per-component-plan/student-app-shell.md`
- `../per-component-plan/reservation-stepper.md`
- `../per-component-plan/reservation-flow-state.md`
- `../per-component-plan/form-field.md`
- `../per-component-plan/button.md`

## Open Decisions

None.
