# Frontend Per-Page Plan

This folder maps planned frontend pages to backend integration points. It is preparation only: page design, component structure, and implementation details should be decided in later page-specific grilling sessions.

Before writing visual tests or implementing any page, inspect the closest references in `docs/frontend/IPB RSH Design/` and record the chosen reference files in that page's design documentation section.

## Page Format

Each page file should use this format:

```md
# Page Name

- Route:
- Role/access:
- Backend APIs:
- Core data:
- Mutations/actions:
- Design references:
- Design documentation:
  - Primary user goal:
  - Layout decisions:
  - State decisions:
  - Responsive decisions:
  - Visual test scenarios:
- Open questions / backend gaps:
```

## Global Integration

- API base URL is configured by the frontend environment.
- Auth uses `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, and `GET /auth/me`.
- Access guards can verify role shell access through `GET /student/shell`, `GET /staff/shell`, and `GET /admin/shell`.
- Notifications are available to authenticated users through `GET /notifications` and `POST /notifications/{notification_id}/read`.
- Organization units are available through `GET /organization-units` where reservation or management forms need them.

## Pages

- [Login](login.md)
- [Student Registration](student-registration.md)
- [Student Dashboard](student-dashboard.md)
- [Facility Catalog](facility-catalog.md)
- [Facility Detail](facility-detail.md)
- [Reservation Time Selection](reservation-time-selection.md)
- [Reservation Details](reservation-details.md)
- [Reservation Verification](reservation-verification.md)
- [Reservation Confirmation](reservation-confirmation.md)
- [Student Reservation List](student-reservation-list.md)
- [Student Reservation Detail](student-reservation-detail.md)
- [Student Approval Letter](student-approval-letter.md)
- [Student Payment](student-payment.md)
- [Student Profile](student-profile.md)
- [Student Notifications](student-notifications.md)
- [Staff Dashboard](staff-dashboard.md)
- [Staff Facility List](staff-facility-list.md)
- [Staff Facility Detail / Edit](staff-facility-detail-edit.md)
- [Staff Facility Reviews](staff-facility-reviews.md)
- [Staff Reservation Review Queue](staff-reservation-review-queue.md)
- [Staff Reservation Review Detail](staff-reservation-review-detail.md)
- [Staff Notifications](staff-notifications.md)
- [Admin Dashboard](admin-dashboard.md)
- [Admin Facility List](admin-facility-list.md)
- [Admin Facility Detail](admin-facility-detail.md)
- [Admin Facility Edit](admin-facility-edit.md)
- [Admin Users](admin-users.md)
- [Admin Organization Units](admin-organization-units.md)
- [Admin Booking Settings](admin-booking-settings.md)
- [Admin Reviews](admin-reviews.md)
- [Admin Audit Logs](admin-audit-logs.md)
- [Admin System Status](admin-system-status.md)
- [Admin Notifications](admin-notifications.md)
