'use client';

import { useEffect } from 'react';
import { addLocale, locale } from 'primereact/api';
import { UK_LOCALE_CODE, UKRAINIAN_PRIME_LOCALE } from '@/constants/common/prime-locale';

export default function PrimeLocaleBootstrap() {
  useEffect(() => {
    try {
      addLocale(UK_LOCALE_CODE, UKRAINIAN_PRIME_LOCALE);
      locale(UK_LOCALE_CODE);
    } catch {
      console.error('Error adding PrimeReact locale');
    }
  }, []);
  return null;
}
