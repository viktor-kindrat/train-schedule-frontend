'use client';

import { useEffect } from 'react';
import type { AuthResponse } from '@/types/auth/auth';
import { DASHBOARD_USER_INFO_STORAGE_KEY } from '@/constants/common/use-user-info';

type Props = Readonly<{ user: AuthResponse['user'] }>;

export default function DashboardUserBootstrap({ user }: Props) {
  useEffect(() => {
    try {
      window.localStorage.setItem(
        DASHBOARD_USER_INFO_STORAGE_KEY,
        JSON.stringify(user)
      );
    } catch {
      // ignore
    }
  }, [user]);

  return null;
}
