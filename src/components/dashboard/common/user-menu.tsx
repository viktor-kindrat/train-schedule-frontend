'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { logoutAction } from '@/actions/auth/auth';
import { useUserInfo } from '@/hooks/common/use-user-info';

export default function UserMenu() {
  const overlayRef = useRef<OverlayPanel | null>(null);
  const { user } = useUserInfo();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Користувач';

  function onToggle(event: React.MouseEvent<HTMLButtonElement>) {
    overlayRef.current?.toggle(event);
  }

  return (
    <div className="relative">
      <Button
        type="button"
        icon="pi pi-user"
        onClick={onToggle}
        className="border-none bg-transparent text-neutral-800 hover:bg-neutral-100"
        aria-label={displayName ? `Меню користувача ${displayName}` : 'Меню користувача'}
      />

      <OverlayPanel ref={overlayRef} className="w-[min(100%,450px)]">
        <div className="px-2 pb-8 text-sm text-neutral-600">
          <div className="body-16-semibold">Користувач:</div>
          {displayName}
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/" onClick={() => overlayRef.current?.hide()}>
            <Button
              label="Інформація про додаток"
              icon="pi pi-info-circle"
              className="w-full"
              text
            />
          </Link>
          <form action={logoutAction} className="w-full">
            <Button
              type="submit"
              label="Вихід"
              icon="pi pi-sign-out p-tag-danger"
              severity="danger"
              className="w-full"
            />
          </form>
        </div>
      </OverlayPanel>
    </div>
  );
}
