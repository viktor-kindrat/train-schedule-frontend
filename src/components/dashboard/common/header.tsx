'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { useSidebar } from '@/hooks/dashboard/common/sidebar-context';
import UserMenu from './user-menu';

export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-[var(--container-7xl)] items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            icon="pi pi-bars"
            onClick={open}
            className="mr-3"
            aria-label="Відкрити меню"
            severity="info"
            text
          />
          <Link href="/dashboard" className="headline-3">
            <span className="text-neutral-900">Rail</span>
            <span className="text-primary-600">Time</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
