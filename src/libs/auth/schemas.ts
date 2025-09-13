import { z } from 'zod';


export const loginSchema = z.object({
  email: z.string().min(1, 'Обовʼязкове поле').email('Невалідний email').max(200, 'Максимум 200 символів'),
  password: z.string().min(1, 'Обовʼязкове поле'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  lastName: z.string().min(1, 'Обовʼязкове поле').max(100, 'Максимум 100 символів'),
  firstName: z.string().min(1, 'Обовʼязкове поле').max(100, 'Максимум 100 символів'),
  email: z.string().min(1, 'Обовʼязкове поле').email('Невалідний email').max(200, 'Максимум 200 символів'),
  password: z.string().min(1, 'Обовʼязкове поле'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type FieldErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;
