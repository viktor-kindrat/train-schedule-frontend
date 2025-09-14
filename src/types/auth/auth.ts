export type UserRole = 'admin' | 'user';

export interface SafeUserDTO {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  role: UserRole;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface RegisterDto {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: SafeUserDTO;
}

export interface FormState<TErrors = Record<string, string | undefined>> {
  ok: boolean;
  message?: string;
  errors?: TErrors;
}
