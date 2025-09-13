'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch, getAuthTokenFromSetCookie, getCookieOptions } from '@/lib/server/api';
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/common/auth';
import { registerSchema, type RegisterSchema } from '@/libs/auth/schemas';

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

  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const setCookie = res.headers.get('set-cookie');
    const token = getAuthTokenFromSetCookie(setCookie);
    if (token) {
      const jar = await cookies();
      jar.set('auth-token', token, getCookieOptions());
    }
    redirect('/dashboard');
  }

  if (res.status === 401) {
    redirect('/auth/login?error=' + encodeURIComponent('Невірні облікові дані'));
  }

  const message = await safeMessage(res);
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

  const res = await apiFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const setCookie = res.headers.get('set-cookie');
    const token = getAuthTokenFromSetCookie(setCookie);
    if (token) {
      const jar = await cookies();
      jar.set('auth-token', token, getCookieOptions());
    } else {
      await loginAfterRegister(email, password);
    }
    redirect('/dashboard');
  }

  if (res.status === 400) {
    const text = await res.text();
    redirect('/auth/register?error=' + encodeURIComponent(text || 'Помилка валідації'));
  }
  if (res.status === 409) {
    redirect('/auth/register?error=' + encodeURIComponent(`Email вже використовується: ${email}`));
  }

  const message = await safeMessage(res);
  redirect('/auth/register?error=' + encodeURIComponent(message));
}

export async function registerValidateAction(
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const raw = {
    lastName: String(formData.get('lastName') || '').trim(),
    firstName: String(formData.get('firstName') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    password: String(formData.get('password') || ''),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten((issue) => issue.message);
    const fieldErrors: Partial<Record<keyof RegisterSchema, string>> = {
      lastName: flat.fieldErrors.lastName?.[0],
      firstName: flat.fieldErrors.firstName?.[0],
      email: flat.fieldErrors.email?.[0],
      password: flat.fieldErrors.password?.[0],
    };
    return { fieldErrors };
  }

  const payload: RegisterDto = parsed.data;
  const res = await apiFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const setCookie = res.headers.get('set-cookie');
    const token = getAuthTokenFromSetCookie(setCookie);
    if (token) {
      const jar = await cookies();
      jar.set('auth-token', token, getCookieOptions());
    } else {
      await loginAfterRegister(payload.email, payload.password);
    }
    redirect('/dashboard');
  }

  if (res.status === 409) {
    return { fieldErrors: { email: `Email вже використовується: ${payload.email}` } };
  }

  if (res.status === 400) {
    const text = await res.text();
    return { formError: text || 'Помилка валідації' };
  }

  const message = await safeMessage(res);
  return { formError: message };
}

export async function logoutAction() {
  await apiFetch('/auth/logout', { method: 'POST' });
  const jar = await cookies();
  jar.delete('auth-token');
  redirect('/');
}

export async function getCurrentUser(): Promise<AuthResponse['user'] | null> {
  const res = await apiFetch('/auth/profile', { method: 'GET' });
  if (res.ok) {
    const data = (await res.json()) as AuthResponse['user'];
    return data;
  }
  return null;
}

async function loginAfterRegister(email: string, password: string) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const setCookie = res.headers.get('set-cookie');
    const token = getAuthTokenFromSetCookie(setCookie);
    if (token) {
      const jar = await cookies();
      jar.set('auth-token', token, getCookieOptions());
    }
  }
}

async function safeMessage(res: Response) {
  try {
    const data = (await res.json()) as { message?: string };
    return data?.message || `${res.status} ${res.statusText}`;
  } catch {
    try {
      const text = await res.text();
      return text || `${res.status} ${res.statusText}`;
    } catch {
      return `${res.status} ${res.statusText}`;
    }
  }
}
