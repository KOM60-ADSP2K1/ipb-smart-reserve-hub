# Staff Reservation Review Detail

- Route: `/staff/reservations/:reservationId`
- Role/access: staff assigned to the reservation facility.
- Backend APIs: `GET /staff/reservations/{reservation_id}/payment-receipt/download`, `POST /staff/reservations/{reservation_id}/payment-review/approve`, `POST /staff/reservations/{reservation_id}/payment-review/reject`, `GET /staff/reservations/{reservation_id}/signed-approval-letter/download`, `POST /staff/reservations/{reservation_id}/document-review/approve`, `POST /staff/reservations/{reservation_id}/document-review/reject`, `POST /staff/reservations/{reservation_id}/cancellation-review/approve`, `POST /staff/reservations/{reservation_id}/cancellation-review/reject`.
- Core data: reservation detail, uploaded documents, payment receipt, cancellation request.
- Mutations/actions: approve/reject payment, approve/reject signed document, approve/reject cancellation.
- Design references: none selected yet.
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: no staff reservation detail endpoint was found; backend may need one before this page can be implemented cleanly.
