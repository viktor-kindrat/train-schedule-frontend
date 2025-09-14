import Link from 'next/link';
import type { ReadonlyChildren } from '@/types/common/ui/i-readonly-children';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: ReadonlyChildren) {
  const store = await cookies();
  const token = store.get('auth-token')?.value;

  if (token) redirect('/dashboard');

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="headline-2 mb-1">
          <Link href="/">
            <span className="text-secondary-900">Rail</span>
            <span className="text-primary-600">Time</span>
          </Link>
        </h1>
        <p className="body-16-regular text-gray-600">Увійдіть або зареєструйтесь, щоб продовжити</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">{children}</div>
      <div className="mt-6 text-center text-sm text-gray-600">
        <Link href="/">Повернутися на головну</Link>
      </div>
    </main>
  );
}
