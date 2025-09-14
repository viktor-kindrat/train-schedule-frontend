'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTokenFromSetCookie,
  getCookieOptions,
  getReadableCookieOptions,
} from '@/lib/common/server/api';
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/auth/auth';
import { registerSchema, type RegisterSchema } from '@/lib/auth/schemas';
import { axiosPrivateServer } from '@/lib/common/server/http';
import type { AxiosResponse } from 'axios';
import { HAS_AUTH_COOKIE } from '@/constants/auth/constants';

export type RegisterFormState = {
  fieldErrors?: Partial<Record<keyof RegisterSchema, string>>;
  formError?: string;
};

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    redirect('/auth/login?error=' + encodeURIComponent('Введіть email і пароль'));
  }

  const payload: LoginDto = { email, password };

  const res = await axiosPrivateServer.post('/auth/login', payload, { responseType: 'json' });

  if (res.status >= 200 && res.status < 300) {
    const setCookie = res.headers['set-cookie'] as string | string[] | undefined;
    const token = getAuthTokenFromSetCookie(setCookie ?? null);
    const jar = await cookies();
    if (token) {
      jar.set('auth-token', token, getCookieOptions());
    }
    jar.set(HAS_AUTH_COOKIE, '1', getReadableCookieOptions());
    redirect('/dashboard');
  }

  if (res.status === 401) {
    redirect('/auth/login?error=' + encodeURIComponent('Невірні облікові дані'));
  }

  const message = safeAxiosMessage(res);
  redirect('/auth/login?error=' + encodeURIComponent(message));
}

export async function registerAction(formData: FormData): Promise<void> {
  const lastName = String(formData.get('lastName') || '').trim();
  const firstName = String(formData.get('firstName') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!lastName || !firstName || !email || !password) {
    redirect('/auth/register?error=' + encodeURIComponent('Перевірте поля форми'));
  }

  const payload: RegisterDto = { lastName, firstName, email, password };

  const res = await axiosPrivateServer.post('/auth/sign-up', payload, { responseType: 'json' });

  if (res.status >= 200 && res.status < 300) {
    const setCookie = res.headers['set-cookie'] as string | string[] | undefined;
    const token = getAuthTokenFromSetCookie(setCookie ?? null);
    const jar = await cookies();
    if (token) {
      jar.set('auth-token', token, getCookieOptions());
    } else {
      await loginAfterRegister(email, password);
    }
    jar.set(HAS_AUTH_COOKIE, '1', getReadableCookieOptions());
    redirect('/dashboard');
  }

  if (res.status === 400) {
    const msg = safeAxiosMessage(res);
    redirect('/auth/register?error=' + encodeURIComponent(msg || 'Помилка валідації'));
  }
  if (res.status === 409) {
    redirect('/auth/register?error=' + encodeURIComponent(`Email вже використовується: ${email}`));
  }

  const message = safeAxiosMessage(res);
  redirect('/auth/register?error=' + encodeURIComponent(message));
}

export async function registerValidateAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    lastName: String(formData.get('lastName') || '').trim(),
    firstName: String(formData.get('firstName') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    password: String(formData.get('password') || ''),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten(issue => issue.message);
    const fieldErrors: Partial<Record<keyof RegisterSchema, string>> = {
      lastName: flat.fieldErrors.lastName?.[0],
      firstName: flat.fieldErrors.firstName?.[0],
      email: flat.fieldErrors.email?.[0],
      password: flat.fieldErrors.password?.[0],
    };
    return { fieldErrors };
  }

  const payload: RegisterDto = parsed.data;
  const res = await axiosPrivateServer.post('/auth/sign-up', payload, { responseType: 'json' });

  if (res.status >= 200 && res.status < 300) {
    const setCookie = res.headers['set-cookie'] as string | string[] | undefined;
    const token = getAuthTokenFromSetCookie(setCookie ?? null);
    const jar = await cookies();
    if (token) {
      jar.set('auth-token', token, getCookieOptions());
    } else {
      await loginAfterRegister(payload.email, payload.password);
    }
    jar.set(HAS_AUTH_COOKIE, '1', getReadableCookieOptions());
    redirect('/dashboard');
  }

  if (res.status === 409) {
    return { fieldErrors: { email: `Email вже використовується: ${payload.email}` } };
  }

  if (res.status === 400) {
    const msg = safeAxiosMessage(res);
    return { formError: msg || 'Помилка валідації' };
  }

  const message = safeAxiosMessage(res);
  return { formError: message };
}

export async function logoutAction() {
  await axiosPrivateServer.post('/auth/logout', undefined, { responseType: 'json' });
  const jar = await cookies();
  jar.delete('auth-token');
  jar.delete(HAS_AUTH_COOKIE);
  redirect('/');
}

export async function getCurrentUser(): Promise<AuthResponse['user'] | null> {
  const res = await axiosPrivateServer.get('/auth/profile', { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    const data = res.data as AuthResponse['user'];
    return data;
  }
  return null;
}

async function loginAfterRegister(email: string, password: string) {
  const res = await axiosPrivateServer.post(
    '/auth/login',
    { email, password },
    { responseType: 'json' }
  );
  if (res.status >= 200 && res.status < 300) {
    const setCookie = res.headers['set-cookie'] as string | string[] | undefined;
    const token = getAuthTokenFromSetCookie(setCookie ?? null);
    if (token) {
      const jar = await cookies();
      jar.set('auth-token', token, getCookieOptions());
    }
  }
}

function hasMessage(value: unknown): value is { message: unknown } {
  return (
    typeof value === 'object' && value !== null && 'message' in (value as Record<string, unknown>)
  );
}

function safeAxiosMessage(res: AxiosResponse): string {
  const data: unknown = res.data;
  if (hasMessage(data)) {
    return String(data.message);
  }
  if (typeof data === 'string') return data;
  return `${res.status} ${res.statusText}`;
}
