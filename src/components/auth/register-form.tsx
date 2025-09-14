'use client';

import Link from 'next/link';
import { registerValidateAction, type RegisterFormState } from '@/actions/auth/auth';
import Input from '@/components/common/form/input';
import SubmitButton from '@/components/common/form/submit-button';
import FormMessage from '@/components/common/form/form-message';
import { useActionState, useCallback, useEffect, useState } from 'react';
import { registerSchema, type RegisterSchema } from '@/lib/auth/schemas';
import { RegisterField, REGISTER_FIELD_ORDER } from '@/constants/auth/constants';
import { getFieldValidationMessage } from '@/lib/common/validation/zod';

type State = RegisterFormState;

type ClientErrors = Partial<Record<keyof RegisterSchema, string>>;

const initialState: State = {};

export default function RegisterForm() {
  const [state, action] = useActionState(registerValidateAction, initialState);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const hasErrors = state.fieldErrors && Object.values(state.fieldErrors).some(Boolean);
    if (hasErrors) {
      setShowErrors(true);
    }
  }, [state.fieldErrors]);

  const validateField = useCallback((fieldName: keyof RegisterSchema, value: string) => {
    const message = getFieldValidationMessage(registerSchema, fieldName, value);
    setClientErrors(prev => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      lastName: String(fd.get('lastName') || '').trim(),
      firstName: String(fd.get('firstName') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || ''),
    };
    const parsed = registerSchema.safeParse(raw);
    if (parsed.success) {
      setClientErrors({});
      return;
    }
    e.preventDefault();
    setShowErrors(true);
    const flat = parsed.error.flatten(issue => issue.message);
    setClientErrors({
      lastName: flat.fieldErrors.lastName?.[0],
      firstName: flat.fieldErrors.firstName?.[0],
      email: flat.fieldErrors.email?.[0],
      password: flat.fieldErrors.password?.[0],
    });
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const firstInvalidField = REGISTER_FIELD_ORDER.find(field => fieldErrors[field]?.[0]);
    if (firstInvalidField) {
      const inputElement = form.querySelector<HTMLInputElement>(`#${firstInvalidField}`);
      inputElement?.focus();
    }
  }, []);

  const getFieldError = useCallback(
    (fieldName: keyof RegisterSchema) =>
      showErrors ? (clientErrors[fieldName] ?? state.fieldErrors?.[fieldName]) : undefined,
    [showErrors, clientErrors, state.fieldErrors]
  );

  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(RegisterField.LastName, e.target.value);
    },
    [validateField]
  );

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(RegisterField.FirstName, e.target.value);
    },
    [validateField]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(RegisterField.Email, e.target.value);
    },
    [validateField]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateField(RegisterField.Password, e.target.value);
    },
    [validateField]
  );

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-2">
      <h2 className="headline-3 mb-4 text-center">Реєстрація</h2>

      <FormMessage message={state.formError} />

      <Input
        id={RegisterField.LastName}
        name={RegisterField.LastName}
        type="text"
        label="Прізвище"
        required
        error={getFieldError(RegisterField.LastName)}
        onChange={handleLastNameChange}
      />
      <Input
        id={RegisterField.FirstName}
        name={RegisterField.FirstName}
        type="text"
        label="Ім'я"
        required
        error={getFieldError(RegisterField.FirstName)}
        onChange={handleFirstNameChange}
      />
      <Input
        id={RegisterField.Email}
        name={RegisterField.Email}
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        error={getFieldError(RegisterField.Email)}
        onChange={handleEmailChange}
      />
      <Input
        id={RegisterField.Password}
        name={RegisterField.Password}
        type="password"
        label="Пароль"
        required
        error={getFieldError(RegisterField.Password)}
        onChange={handlePasswordChange}
      />

      <div className="mt-6 flex items-center justify-between">
        <SubmitButton>Зареєструватися</SubmitButton>
        <Link href="/auth/login" className="text-primary-600 text-sm hover:underline">
          Вже є акаунт? Увійти
        </Link>
      </div>
    </form>
  );
}
