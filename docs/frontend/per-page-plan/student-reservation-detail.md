# Student Reservation Detail

- Route: `/student/reservations/:reservationId`
- Role/access: student.
- Backend APIs: `GET /student/reservations/{reservation_id}`.
- Core data: reservation status, facility, organization unit, activity details, schedule, deadlines, price, cancellation/review state.
- Mutations/actions: cancel reservation, request cancellation, navigate to approval-letter/payment/review flows.
- Design references: `12 Reservation Details Page.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: decide which status-specific actions appear in the first implementation.
