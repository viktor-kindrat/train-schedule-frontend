import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser, logoutAction } from '@/actions/auth';

export default async function DashboardPage() {
  const cookieObject = await cookies();
  const token = cookieObject.get('auth-token')?.value;
  if (!token) redirect('/auth/login');

  console.log(token);

  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <main className="mx-auto w-full max-w-[var(--container-7xl)] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="headline-2">Панель керування</h1>
        <form action={logoutAction}>
          <button className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Вийти</button>
        </form>
      </div>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="headline-3 mb-2">Вітаємо, {user.firstName} {user.lastName}</h2>
        <p className="body-16-regular text-gray-700">Email: {user.email}</p>
        <p className="body-16-regular text-gray-700">Роль: {user.role}</p>
      </section>
    </main>
  );
}
