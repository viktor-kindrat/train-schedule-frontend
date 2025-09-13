'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';

type Props = { ctaHref: string };

export default function Header({ ctaHref }: Props) {
  return (
    <header className="w-full border-b border-neutral-200">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="headline-3">
          Rail<span className="text-primary-600">Time</span>
        </Link>

        <nav className="body-16-regular hidden gap-6 md:flex">
          <a href="#features">Особливості</a>
          <a href="#faq">FAQ</a>
        </nav>

        <Link href={ctaHref} className="ml-4">
          <Button
            label="У додаток"
            icon="pi pi-arrow-right"
            iconPos='right'
            className="bg-primary-600 body-16-semibold rounded-3xl border-none px-6 py-2"
          />
        </Link>
      </div>
    </header>
  );
}
