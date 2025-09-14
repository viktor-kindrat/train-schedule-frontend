'use client';

import { useEffect } from 'react';
import type { AuthResponse } from '@/types/auth/auth';
import { DASHBOARD_USER_INFO_STORAGE_KEY } from '@/constants/common/use-user-info';

type Props = Readonly<{ user: AuthResponse['user'] }>;

export default function DashboardUserBootstrap({ user }: Props) {
  useEffect(() => {
    try {
      globalThis.localStorage.setItem(DASHBOARD_USER_INFO_STORAGE_KEY, JSON.stringify(user));
    } catch {
      console.error('Error saving user info to localStorage');
    }
  }, [user]);

  return null;
}
