'use client';

import { useFormStatus } from 'react-dom';
import { Button } from 'primereact/button';

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  const label = typeof children === 'string' ? (pending ? 'Зачекайте…' : children) : pending ? 'Зачекайте…' : 'Надіслати';
  return (
    <Button
      type="submit"
      label={label}
      loading={pending}
      disabled={pending}
      className="bg-primary-600 body-16-semibold rounded-md border-none px-4 py-2"
    />
  );
}
