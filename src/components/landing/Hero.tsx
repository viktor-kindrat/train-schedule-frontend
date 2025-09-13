'use client';

import { Button } from 'primereact/button';
import Link from 'next/link';

type Props = { ctaHref: string };

export default function Hero({ ctaHref }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(closest-side, var(--color-primary-300), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(closest-side, var(--color-secondary-300), transparent 70%)',
        }}
      />

      <div className="max-w-8xl mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="headline-1">Розклад потягів без зайвих рухів</h1>
          <p className="body-20-regular mt-4 text-neutral-600">
            Пошук, фільтри, сортування та керування рейсами — все в одному місці. Авторизація,
            редагування та оновлення даних — за хвилини.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href={ctaHref}>
              <Button
                label="Почати"
                className="bg-primary-600 body-16-semibold rounded-3xl border-none px-6 py-2"
              />
            </Link>
            <a href="#features">
              <Button
                label="Дізнатись більше"
                className="p-button-outlined text-primary-700 border-primary-300 body-16-semibold rounded-3xl px-6 py-2"
              />
            </a>
          </div>
          <div className="body-14-regular mt-6 flex items-center gap-3 text-neutral-500">
            <i className="pi pi-lock" /> JWT · <i className="pi pi-database" /> PostgreSQL ·{' '}
            <i className="pi pi-cloud" /> Deploy-ready
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm">
          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <span className="body-16-semibold">Kyiv → Lviv</span>
              <span className="caption-regular text-neutral-500">№ 123 · 5h 10m</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {['Odesa → Kharkiv', 'Dnipro → Lviv', 'Kharkiv → Poltava'].map((r, i) => (
                <div key={i} className="body-14-regular rounded-xl border border-neutral-200 p-3">
                  {r}
                  <div className="caption-regular mt-1 text-neutral-500">Сьогодні • оновлено</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
