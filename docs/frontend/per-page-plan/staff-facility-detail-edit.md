# Staff Facility Detail / Edit

- Route: `/staff/facilities/:facilityId`
- Role/access: staff assigned to facility.
- Backend APIs: `GET /staff/facilities`, `PATCH /staff/facilities/{facility_id}`, `POST /staff/facilities/{facility_id}/deactivate`, `POST /staff/facilities/{facility_id}/images`, `POST /staff/facilities/{facility_id}/open-hours`, `POST /staff/facilities/{facility_id}/blackouts`.
- Core data: facility profile, images, open hours, blackouts.
- Mutations/actions: update facility profile, deactivate facility, add image, add open hour, add blackout.
- Design references: none selected yet.
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: no dedicated `GET /staff/facilities/{facility_id}` endpoint is exposed; frontend may need to select from `GET /staff/facilities` or backend may need a detail endpoint.
