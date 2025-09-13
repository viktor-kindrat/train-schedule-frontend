'use client';

import { Card } from 'primereact/card';

export default function Features() {
  const items = [
    {
      icon: 'pi pi-search',
      title: 'Пошук & фільтри',
      text: 'Миттєво знаходь рейси та звужуй видачу.',
    },
    {
      icon: 'pi pi-pencil',
      title: 'CRUD-керування',
      text: 'Додавання, редагування, видалення, оновлення.',
    },
    { icon: 'pi pi-user', title: 'JWT авторизація', text: 'Логін/реєстрація, захищені маршрути.' },
  ];

  return (
    <section id="features" className="max-w-8xl mx-auto px-4 py-16 md:py-24">
      <h2 className="headline-2 text-center">Особливості</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(it => (
          <Card key={it.title}>
            <div className="flex flex-col items-center justify-center gap-3">
              <i className={`${it.icon} text-primary-600 self-center mb-5`} style={{ fontSize: '2.8rem' }} />
              <div>
                <h3 className="headline-3 text-center">{it.title}</h3>
                <p className="body-16-regular mt-1 text-center text-neutral-600">{it.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
