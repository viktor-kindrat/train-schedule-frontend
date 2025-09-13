import { z } from 'zod';

export function getFieldValidationMessage<S extends z.ZodRawShape>(
  schema: z.ZodObject<S>,
  fieldName: keyof S,
  value: unknown,
  defaultMessage = 'Невірне значення',
): string {
  const fieldSchema = (schema.shape as unknown as Record<string, z.ZodTypeAny>)[fieldName as string];
  const res = fieldSchema.safeParse(value);
  if (res.success) return '';
  return res.error.issues[0]?.message ?? defaultMessage;
}
