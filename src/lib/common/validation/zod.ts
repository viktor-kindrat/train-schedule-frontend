import { z } from 'zod';

export function getFieldValidationMessage<Schema extends z.ZodObject<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: Schema,
  fieldName: keyof z.infer<Schema>,
  value: unknown,
  defaultMessage = 'Невірне значення'
): string {
  // Zod v4 classic does not export ZodRawShape; use the runtime shape and type it as a record of ZodType
  const shape = (schema as unknown as { shape: Record<string, z.ZodType> }).shape;
  const key = String(fieldName);
  const fieldSchema = shape[key] as z.ZodType;
  const res = fieldSchema.safeParse(value);
  if (res.success) return '';
  return res.error.issues[0]?.message ?? defaultMessage;
}
