# Reservation Time Selection

- Route: `/student/facilities/:facilityId/reserve/time`
- Role/access: student.
- Backend APIs: `GET /facilities/{facility_id}`, `GET /facilities/{facility_id}/calendar`, `POST /facilities/{facility_id}/reservation-time-selection`.
- Core data: facility rules/context, selected date, start time, end time, validation result.
- Mutations/actions: validate selected reservation window.
- Design references: `03 Reservation - Step 1.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: none known. Use `startsAt` and `endsAt` URL search params after successful validation.
