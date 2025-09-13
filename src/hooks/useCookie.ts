'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

function readCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const v = Cookies.get(name);
  return typeof v === 'string' ? v : null;
}

export function useCookie(name: string, options?: { pollMs?: number }) {
  const pollMs = options?.pollMs ?? 1000;
  const [value, setValue] = useState<string | null>(() => readCookie(name));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const v = readCookie(name);
      setValue((prev) => (prev !== v ? v : prev));
    };

    update();

    const onFocus = () => update();
    const onVisibility = () => update();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    timerRef.current = window.setInterval(update, pollMs);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [name, pollMs]);

  return value;
}
