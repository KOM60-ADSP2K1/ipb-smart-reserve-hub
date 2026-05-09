# Admin Facility Edit

- Route: `/admin/facilities/:facilityId/edit`
- Role/access: admin.
- Backend APIs: `PUT /admin/facilities/{facility_id}/staff-assignments/{staff_id}`, `DELETE /admin/facilities/{facility_id}/staff-assignments/{staff_id}`, plus admin facility update endpoints not yet identified.
- Core data: facility management fields, staff assignments.
- Mutations/actions: assign/unassign staff, update facility if backend support is added.
- Design references: `23 Admin Facility Edit Page.png`
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: admin facility update/create/delete endpoints were not found; staff assignment endpoints exist.
