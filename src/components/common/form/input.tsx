'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import type { InputTextProps } from 'primereact/inputtext';

export type InputProps = Omit<InputTextProps, 'ref'> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, id, className, type, ...rest }: InputProps) {
  const invalid = Boolean(error);
  return (
    <div className="mb-4">
      {label ? (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <InputText
        id={id}
        type={type}
        className={'w-full ' + (invalid ? 'p-invalid' : '') + (className ? ' ' + className : '')}
        aria-invalid={invalid}
        {...rest}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
