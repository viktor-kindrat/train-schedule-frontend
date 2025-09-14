'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AuthResponse } from '@/types/auth/auth';
import { API_BASE } from '@/constants/common/api';

import type { UseUserInfo, UseUserInfoOptions } from '@/types/common/use-user-info';
export type { UseUserInfo, UseUserInfoOptions } from '@/types/common/use-user-info';

import { DASHBOARD_USER_INFO_STORAGE_KEY } from '@/constants/common/use-user-info';

function isSafeUser(value: unknown): value is AuthResponse['user'] {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    'lastName' in value &&
    'firstName' in value &&
    'email' in value &&
    'role' in value &&
    'createdAt' in value
  );
}

function readFromLocalStorage(key: string): AuthResponse['user'] | null {
  try {
    const raw = globalThis.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isSafeUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeToLocalStorage(key: string, value: AuthResponse['user'] | null): void {
  try {
    if (!value) {
      globalThis.localStorage.removeItem(key);
      return;
    }
    const serialized = JSON.stringify(value);
    globalThis.localStorage.setItem(key, serialized);
  } catch {
    // ignore errors in production
  }
}

export function useUserInfo(options?: UseUserInfoOptions): UseUserInfo {
  const storageKey = options?.storageKey || DASHBOARD_USER_INFO_STORAGE_KEY;
  const initializedRef = useRef<boolean>(false);

  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const cached = readFromLocalStorage(storageKey);
    setUser(cached);
    setLoading(false);
  }, [storageKey]);

  const setUserInfo = useCallback(
    (value: AuthResponse['user'] | null) => {
      setUser(value);
      writeToLocalStorage(storageKey, value);
    },
    [storageKey]
  );

  const clear = useCallback(() => {
    setUser(null);
    writeToLocalStorage(storageKey, null);
  }, [storageKey]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = API_BASE && API_BASE.startsWith('http') ? API_BASE : '';
      if (!base) {
        setLoading(false);
        return;
      }
      const response = await fetch(base + '/auth/profile', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        const userData = isSafeUser(data) ? data : null;
        setUser(userData);
        writeToLocalStorage(storageKey, userData);
        setLoading(false);
        return;
      }
      setError(String(response.status) + ' ' + response.statusText);
      setLoading(false);
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Помилка оновлення користувача');
      setLoading(false);
    }
  }, [storageKey]);

  return useMemo<UseUserInfo>(
    () => ({ user, loading, error, setUserInfo, refresh, clear }),
    [user, loading, error, setUserInfo, refresh, clear]
  );
}
