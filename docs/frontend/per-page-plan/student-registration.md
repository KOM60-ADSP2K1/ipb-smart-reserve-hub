# Student Registration

- Route: `/register`
- Role/access: unauthenticated student self-registration.
- Backend APIs: `POST /auth/register`, then either `POST /auth/login` or manual login redirect.
- Core data: email, password, full name, NIM, phone.
- Mutations/actions: create student account.
- Design references: `docs/frontend/IPB RSH Design/00 Log in Page.png`, supplied login reference image.
- Design documentation:
  - Primary user goal: create a student account with institutional identity details, then sign in separately.
  - Layout decisions: reuse the login split-screen auth shell so `/login` and `/register` feel like one auth family; keep brand/form on the left and campus visual on the right for desktop.
  - State decisions: validate required fields, email shape, password minimum length, and password confirmation match before calling the backend; NIM and phone are required only. Show backend errors such as disallowed email domain or duplicate email without storing a token. On success, redirect to `/login` with a success message.
  - Responsive decisions: collapse to a single-column form on mobile and omit the large image panel.
  - Visual test scenarios: desktop registration form, mobile registration form, successful redirect message on login, backend error state.
- Open questions / backend gaps: backend remains the source of truth for allowed student email domains; current default is `@apps.ipb.ac.id`.
