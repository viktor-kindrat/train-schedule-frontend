'use client';

import Link from 'next/link';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useSidebar } from '@/hooks/dashboard/common/sidebar-context';

export type NavItem = {
  title: string;
  href: string;
  icon?: string;
};

type Props = {
  items: ReadonlyArray<NavItem>;
};

export default function AppSidebar({ items }: Props) {
  const { visible, close } = useSidebar();

  return (
    <Sidebar visible={visible} onHide={close} position="left">
      <div className="body-20-semibold mb-5 w-full text-center">Оберіть із меню</div>
      <nav className="flex flex-col gap-3">
        {items.map(item => (
          <Link key={item.href} href={item.href} onClick={close}>
            <Button label={item.title} icon={item.icon} className="body-16-semibold w-full" text />
          </Link>
        ))}
      </nav>
    </Sidebar>
  );
}
