# Admin Organization Units

- Route: `/admin/organization-units`
- Role/access: admin.
- Backend APIs: `GET /organization-units`, `POST /admin/organization-units`, `PATCH /admin/organization-units/{organization_unit_id}`, `POST /admin/organization-units/{organization_unit_id}/activate`, `POST /admin/organization-units/{organization_unit_id}/deactivate`.
- Core data: organization unit name, type, code, active state.
- Mutations/actions: create, edit, activate, deactivate.
- Design references: none selected yet.
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps: public list only returns active units; admin may need an all-units endpoint to manage inactive units.
