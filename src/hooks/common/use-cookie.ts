'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

function hasWindow(): boolean {
  return 'window' in globalThis;
}

function readCookie(name: string): string | null {
  if (!hasWindow()) return null;
  const v = Cookies.get(name);
  if (v === undefined) return null;
  return v;
}

export function useCookie(name: string, options?: { pollMs?: number }) {
  const pollMs = options?.pollMs ?? 1000;
  const [value, setValue] = useState<string | null>(() => readCookie(name));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const v = readCookie(name);
      setValue(prev => (prev === v ? prev : v));
    };

    update();

    const onFocus = () => update();
    const onVisibility = () => update();

    if (hasWindow()) {
      globalThis.window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibility);
      timerRef.current = globalThis.window.setInterval(update, pollMs);
    }

    return () => {
      if (hasWindow()) {
        globalThis.window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibility);
        if (timerRef.current !== null) {
          globalThis.window.clearInterval(timerRef.current);
        }
      }
    };
  }, [name, pollMs]);

  return value;
}
