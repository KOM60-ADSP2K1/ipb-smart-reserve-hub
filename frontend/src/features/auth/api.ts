import { apiRequest } from '../../shared/api';

export type UserRole = 'student' | 'staff' | 'super_admin';

export type CurrentUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type StudentRegistrationPayload = {
  email: string;
  password: string;
  full_name: string;
  nim: string;
  phone: string;
};

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function registerStudent(payload: StudentRegistrationPayload): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/auth/me');
}

export function getRoleLandingPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    student: '/student',
    staff: '/staff',
    super_admin: '/admin',
  };

  return paths[role];
}
