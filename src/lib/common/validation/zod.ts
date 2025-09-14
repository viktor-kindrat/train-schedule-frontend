import { z } from 'zod';

export function getFieldValidationMessage<Schema extends z.ZodObject<z.ZodRawShape>>(
  schema: Schema,
  fieldName: keyof z.infer<Schema>,
  value: unknown,
  defaultMessage = 'Невірне значення'
): string {
  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  const key = String(fieldName);
  const fieldSchema = shape[key];
  const res = fieldSchema.safeParse(value);
  if (res.success) return '';
  return res.error.issues[0]?.message ?? defaultMessage;
}
