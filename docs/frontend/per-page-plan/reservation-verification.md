# Reservation Verification

- Route: no separate route required initially; conceptual step within `/reserve/details` or `/reserve/confirm`.
- Role/access: student.
- Backend APIs: `POST /facilities/{facility_id}/reservation-time-selection`, later `POST /facilities/{facility_id}/reservations`.
- Core data: validation status, denied reasons, verification messages.
- Mutations/actions: revalidate or return to editable steps.
- Design references: `05 Reservation - Step 3.png`, `06 Reservation - Step 3 Verif.png`, `07 Reservation - Step 3 Denied.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: no backend change needed unless this becomes a persisted draft, slot hold, or separate eligibility check.
