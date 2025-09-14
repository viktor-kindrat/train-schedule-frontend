'use client';

import { useFormStatus } from 'react-dom';
import { Button } from 'primereact/button';

function isStringNode(value: React.ReactNode): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  let label: string;
  if (pending) {
    label = 'Зачекайте…';
  } else if (isStringNode(children)) {
    label = children;
  } else {
    label = 'Надіслати';
  }
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
