'use client';

import Link from 'next/link';
import { loginAction } from '@/actions/auth/auth';
import Input from '@/components/common/form/input';
import SubmitButton from '@/components/common/form/submit-button';
import FormMessage from '@/components/common/form/form-message';
import { useCallback, useState } from 'react';
import { loginSchema, type LoginSchema } from '@/lib/auth/schemas';
import { LoginField, LOGIN_FIELD_ORDER } from '@/constants/auth/constants';
import { getFieldValidationMessage } from '@/lib/common/validation/zod';

export default function LoginForm({ formError }: { formError?: string }) {
  const [clientErrors, setClientErrors] = useState<Partial<Record<keyof LoginSchema, string>>>({});
  const [showErrors, setShowErrors] = useState(false);

  const validateField = useCallback((fieldName: keyof LoginSchema, value: string) => {
    const message = getFieldValidationMessage(loginSchema, fieldName, value);
    setClientErrors(prev => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || ''),
    };
    const parsed = loginSchema.safeParse(raw);
    if (parsed.success) {
      setClientErrors({});
      return;
    }
    e.preventDefault();
    setShowErrors(true);
    const flat = parsed.error.flatten(issue => issue.message);
    setClientErrors({
      email: flat.fieldErrors.email?.[0],
      password: flat.fieldErrors.password?.[0],
    });
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const firstInvalidField = LOGIN_FIELD_ORDER.find(field => fieldErrors[field]?.[0]);
    if (firstInvalidField) {
      const inputElement = form.querySelector<HTMLInputElement>(`#${firstInvalidField}`);
      inputElement?.focus();
    }
  }, []);

  const emailError = showErrors ? clientErrors.email : undefined;
  const passwordError = showErrors ? clientErrors.password : undefined;

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(LoginField.Email, e.target.value);
    },
    [validateField]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(LoginField.Password, e.target.value);
    },
    [validateField]
  );

  return (
    <form action={loginAction} onSubmit={handleSubmit} className="space-y-2">
      <h2 className="headline-3 mb-4 text-center">Вхід</h2>

      <FormMessage message={formError} />

      <Input
        id={LoginField.Email}
        name={LoginField.Email}
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        error={emailError}
        onChange={handleEmailChange}
      />
      <Input
        id={LoginField.Password}
        name={LoginField.Password}
        type="password"
        label="Пароль"
        required
        error={passwordError}
        onChange={handlePasswordChange}
      />

      <div className="mt-6 flex items-center justify-between">
        <SubmitButton>Увійти</SubmitButton>
        <Link href="/auth/register" className="text-primary-600 text-sm hover:underline">
          Створити акаунт
        </Link>
      </div>
    </form>
  );
}
