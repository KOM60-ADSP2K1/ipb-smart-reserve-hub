# Reservation Confirmation

- Route: `/student/facilities/:facilityId/reserve/confirm`
- Role/access: student.
- Backend APIs: `GET /facilities/{facility_id}`, `GET /organization-units`, `POST /facilities/{facility_id}/reservations`.
- Core data: selected time, facility summary, organization unit, activity details, price.
- Mutations/actions: submit reservation, navigate to created reservation detail.
- Design references: `08 Reservation - Step 4.png`, `09 Reservation - Step 4 Verif.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: decide how confirmation receives details form data if the user reloads this route.
