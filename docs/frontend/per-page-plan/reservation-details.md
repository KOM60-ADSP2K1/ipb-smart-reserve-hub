# Reservation Details

- Route: `/student/facilities/:facilityId/reserve/details`
- Role/access: student.
- Backend APIs: `GET /facilities/{facility_id}`, `GET /organization-units`, optional repeat `POST /facilities/{facility_id}/reservation-time-selection`.
- Core data: selected time from URL params, organization units, activity title, event description, participant count, contact phone.
- Mutations/actions: continue to confirmation.
- Design references: `04 Reservation - Step 2.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: decide whether details form state is kept only in memory or persisted across route reloads.
