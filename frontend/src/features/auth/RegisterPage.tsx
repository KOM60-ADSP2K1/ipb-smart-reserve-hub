import { ArrowRight, IdCard, Lock, Mail, Phone, User } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { ApiError } from '../../shared/api';
import { AuthCampusVisual } from './AuthCampusVisual';
import { registerStudent } from './api';

type FormValues = {
  fullName: string;
  nim: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  fullName: '',
  nim: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (typeof error.detail === 'string') {
      return error.detail;
    }

    return error.message;
  }

  return 'Unable to create account. Please try again.';
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const trimmedEmail = values.email.trim();

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.nim.trim()) {
    errors.nim = 'NIM is required.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  }

  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match.';
  }

  return errors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldErrorId = useMemo(
    () => ({
      fullName: errors.fullName ? 'register-full-name-error' : undefined,
      nim: errors.nim ? 'register-nim-error' : undefined,
      phone: errors.phone ? 'register-phone-error' : undefined,
      email: errors.email ? 'register-email-error' : undefined,
      password: errors.password ? 'register-password-error' : undefined,
      confirmPassword: errors.confirmPassword ? 'register-confirm-password-error' : undefined,
    }),
    [errors],
  );

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    if (formError) {
      setFormError(null);
    }

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerStudent({
        email: values.email.trim(),
        password: values.password,
        full_name: values.fullName.trim(),
        nim: values.nim.trim(),
        phone: values.phone.trim(),
      });
      navigate('/login', {
        replace: true,
        state: { registrationSuccess: 'Account created. Sign in with your new credentials.' },
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-container-lowest text-primary">
      <div className="grid min-h-screen lg:grid-cols-[55fr_45fr]">
        <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-20">
          <div className="mx-auto flex w-full max-w-[750px] flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center py-6">
              <div className="mb-9 text-center">
                <p className="font-serif text-[56px] font-bold leading-[0.82] text-secondary sm:text-[76px]">
                  <span className="block text-[#57bd8b]">IPB</span>
                  <span className="block text-[#009688]">SRH</span>
                </p>
                <h1 className="mt-5 text-3xl font-bold tracking-normal text-primary sm:text-4xl">
                  IPB Smart Reserve Hub
                </h1>
              </div>

              <form className="w-full" noValidate onSubmit={handleSubmit}>
                <fieldset disabled={isSubmitting} className="space-y-5 disabled:opacity-70">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">Create Student Account</h2>
                    <p className="mt-2 max-w-md text-base leading-6 text-on-surface-variant">
                      Register with your IPB student identity to reserve campus facilities.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-sm font-bold text-on-surface-variant" htmlFor="register-full-name">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                        />
                        <input
                          aria-describedby={fieldErrorId.fullName}
                          aria-invalid={Boolean(errors.fullName)}
                          autoComplete="name"
                          className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                          id="register-full-name"
                          name="fullName"
                          onChange={(event) => updateValue('fullName', event.target.value)}
                          placeholder="Budi Santoso"
                          type="text"
                          value={values.fullName}
                        />
                      </div>
                      {errors.fullName ? (
                        <p className="text-sm font-medium text-error" id="register-full-name-error">
                          {errors.fullName}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface-variant" htmlFor="register-nim">
                        NIM
                      </label>
                      <div className="relative">
                        <IdCard
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                        />
                        <input
                          aria-describedby={fieldErrorId.nim}
                          aria-invalid={Boolean(errors.nim)}
                          autoComplete="off"
                          className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                          id="register-nim"
                          name="nim"
                          onChange={(event) => updateValue('nim', event.target.value)}
                          placeholder="G64190001"
                          type="text"
                          value={values.nim}
                        />
                      </div>
                      {errors.nim ? (
                        <p className="text-sm font-medium text-error" id="register-nim-error">
                          {errors.nim}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface-variant" htmlFor="register-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                        />
                        <input
                          aria-describedby={fieldErrorId.phone}
                          aria-invalid={Boolean(errors.phone)}
                          autoComplete="tel"
                          className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                          id="register-phone"
                          name="phone"
                          onChange={(event) => updateValue('phone', event.target.value)}
                          placeholder="08123456789"
                          type="tel"
                          value={values.phone}
                        />
                      </div>
                      {errors.phone ? (
                        <p className="text-sm font-medium text-error" id="register-phone-error">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface-variant" htmlFor="register-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                      />
                      <input
                        aria-describedby={fieldErrorId.email ? `${fieldErrorId.email} register-email-help` : 'register-email-help'}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                        id="register-email"
                        name="email"
                        onChange={(event) => updateValue('email', event.target.value)}
                        placeholder="name@apps.ipb.ac.id"
                        type="email"
                        value={values.email}
                      />
                    </div>
                    <p className="text-sm text-on-surface-variant" id="register-email-help">
                      Use your institutional student email, for example @apps.ipb.ac.id.
                    </p>
                    {errors.email ? (
                      <p className="text-sm font-medium text-error" id="register-email-error">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface-variant" htmlFor="register-password">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                        />
                        <input
                          aria-describedby={fieldErrorId.password}
                          aria-invalid={Boolean(errors.password)}
                          autoComplete="new-password"
                          className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                          id="register-password"
                          name="password"
                          onChange={(event) => updateValue('password', event.target.value)}
                          placeholder="Minimum 8 characters"
                          type="password"
                          value={values.password}
                        />
                      </div>
                      {errors.password ? (
                        <p className="text-sm font-medium text-error" id="register-password-error">
                          {errors.password}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-sm font-bold text-on-surface-variant"
                        htmlFor="register-confirm-password"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
                        />
                        <input
                          aria-describedby={fieldErrorId.confirmPassword}
                          aria-invalid={Boolean(errors.confirmPassword)}
                          autoComplete="new-password"
                          className="h-12 w-full rounded-xl border border-outline bg-surface-container-lowest pl-12 pr-4 text-base outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
                          id="register-confirm-password"
                          name="confirmPassword"
                          onChange={(event) => updateValue('confirmPassword', event.target.value)}
                          placeholder="Repeat password"
                          type="password"
                          value={values.confirmPassword}
                        />
                      </div>
                      {errors.confirmPassword ? (
                        <p className="text-sm font-medium text-error" id="register-confirm-password-error">
                          {errors.confirmPassword}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {formError ? (
                    <div className="rounded-xl border border-error/25 bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container">
                      {formError}
                    </div>
                  ) : null}

                  <button
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#07996f] px-5 text-base font-bold text-white transition hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                    {!isSubmitting ? <ArrowRight aria-hidden="true" className="size-5" /> : null}
                  </button>

                  <p className="text-center text-sm font-medium text-on-surface-variant">
                    Already registered?{' '}
                    <Link className="font-bold text-secondary transition hover:text-primary" to="/login">
                      Sign in
                    </Link>
                  </p>
                </fieldset>
              </form>
            </div>

            <footer className="pb-4 text-center text-xs font-medium text-outline">
              <p>© 2026 IPB Smart Reserve Hub.</p>
              <p className="mt-2">
                Security Protocol <span className="mx-4">·</span> Terms of Access
              </p>
            </footer>
          </div>
        </section>

        <AuthCampusVisual />
      </div>
    </main>
  );
}
