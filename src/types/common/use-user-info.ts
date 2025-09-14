import type { AuthResponse } from '@/types/auth/auth';

export type UseUserInfoOptions = Readonly<{
  storageKey?: string;
}>;

export type UseUserInfo = Readonly<{
  user: AuthResponse['user'] | null;
  loading: boolean;
  error: string | null;
  setUserInfo: (value: AuthResponse['user'] | null) => void;
  refresh: () => Promise<void>;
  clear: () => void;
}>;
