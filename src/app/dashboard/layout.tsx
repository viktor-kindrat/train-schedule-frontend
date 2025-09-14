import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth/auth';
import { ReadonlyChildren } from '@/types/common/ui/i-readonly-children';
import { SidebarProvider } from '@/hooks/dashboard/common/sidebar-context';
import Header from '@/components/dashboard/common/header';
import AppSidebar, { type NavItem } from '@/components/dashboard/common/app-sidebar';
import DashboardUserBootstrap from '@/components/dashboard/common/dashboard-user-bootstrap';

export default async function DashboardLayout({ children }: ReadonlyChildren) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) redirect('/auth/login');

  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const navItems: ReadonlyArray<NavItem> = [
    { title: 'Панель керування', href: '/dashboard', icon: 'pi pi-home' },
    { title: 'Керування потягами', href: '/dashboard/manage-train', icon: 'pi pi-plus-circle' },
    { title: 'Шукати потяг', href: '/dashboard/search-train', icon: 'pi pi-search' },
  ];

  return (
    <SidebarProvider>
      <DashboardUserBootstrap user={user} />
      <Header />
      <AppSidebar items={navItems} />
      <main className="mx-auto w-full max-w-[var(--container-7xl)] px-4 py-6">{children}</main>
    </SidebarProvider>
  );
}
