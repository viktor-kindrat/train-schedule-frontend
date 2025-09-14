export default function FormMessage({
  message,
  variant = 'error',
}: {
  message?: string;
  variant?: 'error' | 'info' | 'success';
}) {
  if (!message) return null;
  let color: string;
  if (variant === 'error') {
    color = 'text-red-700 bg-red-50 border-red-200';
  } else if (variant === 'success') {
    color = 'text-green-700 bg-green-50 border-green-200';
  } else {
    color = 'text-blue-700 bg-blue-50 border-blue-200';
  }
  return <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${color}`}>{message}</div>;
}
