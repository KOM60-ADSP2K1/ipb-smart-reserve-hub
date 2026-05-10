import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { authSession } from '../../shared/auth';
import { renderWithProviders } from '../../test/render';
import { server } from '../../test/mocks/server';
import { routes } from '../../routes/router';

afterEach(() => {
  authSession.clearAccessToken();
});

it('signs in a student and redirects to the student landing page', async () => {
  let loginPayload: unknown;
  let meAuthorization: string | null = null;
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/login', async ({ request }) => {
      loginPayload = await request.json();

      return HttpResponse.json({ access_token: 'student-token', token_type: 'bearer' });
    }),
    http.get('http://localhost:8000/auth/me', ({ request }) => {
      meAuthorization = request.headers.get('Authorization');

      return HttpResponse.json({
        id: 'user-1',
        email: 'budi@apps.ipb.ac.id',
        full_name: 'Budi Santoso',
        role: 'student',
        is_active: true,
      });
    }),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/email address/i), 'budi@apps.ipb.ac.id');
  await user.type(screen.getByLabelText(/password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(await screen.findByRole('heading', { name: /student dashboard/i })).toBeInTheDocument();
  expect(screen.getByText(/budi@apps\.ipb\.ac\.id/i)).toBeInTheDocument();

  await waitFor(() => expect(authSession.getAccessToken()).toBe('student-token'));
  expect(loginPayload).toEqual({ email: 'budi@apps.ipb.ac.id', password: 'secret123' });
  expect(meAuthorization).toBe('Bearer student-token');
});

it('shows backend login errors without storing a token', async () => {
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/login', () =>
      HttpResponse.json({ detail: 'Email atau password salah.' }, { status: 401 }),
    ),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/email address/i), 'budi@apps.ipb.ac.id');
  await user.type(screen.getByLabelText(/password/i), 'wrong-password');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(await screen.findByText('Email atau password salah.')).toBeInTheDocument();
  expect(authSession.getAccessToken()).toBeNull();
});

it('redirects an already-authenticated staff user away from login', async () => {
  authSession.setAccessToken('staff-token');

  server.use(
    http.get('http://localhost:8000/auth/me', ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer staff-token');

      return HttpResponse.json({
        id: 'staff-1',
        email: 'staff@ipb.ac.id',
        full_name: 'Staff IPB',
        role: 'staff',
        is_active: true,
      });
    }),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  renderWithProviders(<RouterProvider router={router} />);

  expect(await screen.findByRole('heading', { name: /staff dashboard/i })).toBeInTheDocument();
  expect(screen.getByText(/staff@ipb\.ac\.id/i)).toBeInTheDocument();
});

it('clears an invalid stored token and shows the login form', async () => {
  authSession.setAccessToken('expired-token');

  server.use(
    http.get('http://localhost:8000/auth/me', () => HttpResponse.json({ detail: 'Token tidak valid.' }, { status: 401 })),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  renderWithProviders(<RouterProvider router={router} />);

  expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  expect(authSession.getAccessToken()).toBeNull();
});

it('validates required login fields before calling the backend', async () => {
  let loginRequests = 0;
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/login', () => {
      loginRequests += 1;

      return HttpResponse.json({ access_token: 'unused-token', token_type: 'bearer' });
    }),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(await screen.findByText('Email address is required.')).toBeInTheDocument();
  expect(screen.getByText('Password is required.')).toBeInTheDocument();
  expect(loginRequests).toBe(0);
});

it('registers a student account and redirects to login with a success message', async () => {
  let registrationPayload: unknown;
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/register', async ({ request }) => {
      registrationPayload = await request.json();

      return HttpResponse.json(
        {
          id: 'user-1',
          email: 'budi@apps.ipb.ac.id',
          full_name: 'Budi Santoso',
          role: 'student',
          is_active: true,
        },
        { status: 201 },
      );
    }),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/register'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/full name/i), 'Budi Santoso');
  await user.type(screen.getByLabelText(/nim/i), 'G64190001');
  await user.type(screen.getByLabelText(/phone/i), '08123456789');
  await user.type(screen.getByLabelText(/email address/i), 'budi@apps.ipb.ac.id');
  await user.type(screen.getByLabelText(/^password$/i), 'secret123');
  await user.type(screen.getByLabelText(/confirm password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /create account/i }));

  expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByText(/account created/i)).toBeInTheDocument();
  expect(registrationPayload).toEqual({
    email: 'budi@apps.ipb.ac.id',
    password: 'secret123',
    full_name: 'Budi Santoso',
    nim: 'G64190001',
    phone: '08123456789',
  });
  expect(authSession.getAccessToken()).toBeNull();
});

it('shows backend registration errors without redirecting', async () => {
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/register', () =>
      HttpResponse.json({ detail: 'Email sudah terdaftar.' }, { status: 409 }),
    ),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/register'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/full name/i), 'Budi Santoso');
  await user.type(screen.getByLabelText(/nim/i), 'G64190001');
  await user.type(screen.getByLabelText(/phone/i), '08123456789');
  await user.type(screen.getByLabelText(/email address/i), 'budi@apps.ipb.ac.id');
  await user.type(screen.getByLabelText(/^password$/i), 'secret123');
  await user.type(screen.getByLabelText(/confirm password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /create account/i }));

  expect(await screen.findByText('Email sudah terdaftar.')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /create student account/i })).toBeInTheDocument();
});

it('validates registration fields before calling the backend', async () => {
  let registrationRequests = 0;
  const user = userEvent.setup();

  server.use(
    http.post('http://localhost:8000/auth/register', () => {
      registrationRequests += 1;

      return HttpResponse.json({}, { status: 201 });
    }),
  );

  const router = createMemoryRouter(routes, { initialEntries: ['/register'] });
  renderWithProviders(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
  await user.type(screen.getByLabelText(/^password$/i), 'short');
  await user.type(screen.getByLabelText(/confirm password/i), 'different');
  await user.click(screen.getByRole('button', { name: /create account/i }));

  expect(await screen.findByText('Full name is required.')).toBeInTheDocument();
  expect(screen.getByText('NIM is required.')).toBeInTheDocument();
  expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
  expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  expect(screen.getByText('Passwords must match.')).toBeInTheDocument();
  expect(registrationRequests).toBe(0);
});
