'use client';

import { Accordion, AccordionTab } from 'primereact/accordion';

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto w-full max-w-[var(--container-8xl)] px-4 py-16 md:py-24">
      <h2 className="headline-2 text-center">Поширені запитання</h2>

      <div className="mt-8 w-full rounded-3xl">
        <Accordion multiple className="!border-0 !bg-transparent">
          <AccordionTab
            header="Як працює авторизація?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Ми використовуємо JWT: після логіну бекенд повертає токен, який зберігається в httpOnly
            cookie
            <code className="mx-1 rounded bg-neutral-200 px-1">auth-token</code>. Якщо cookie
            присутня — кнопки лендінгу ведуть у{' '}
            <code className="mx-1 rounded bg-neutral-200 px-1">/dashboard</code>, інакше — у{' '}
            <code className="mx-1 rounded bg-neutral-200 px-1">/auth</code>.
          </AccordionTab>

          <AccordionTab
            header="Звідки беруться дані розкладу?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Дані зберігаються в PostgreSQL. CRUD-ендпоїнти бекенду (NestJS) дозволяють додавати,
            оновлювати, видаляти й читати рейси. Також є пагінація, сортування та пошук.
          </AccordionTab>

          <AccordionTab
            header="Чи можна редагувати рейси з інтерфейсу?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Так. У <code className="mx-1 rounded bg-neutral-200 px-1">/dashboard</code> доступні
            форми додавання/редагування, масові дії та фільтри за станцією відправлення/прибуття,
            датою, тривалістю тощо.
          </AccordionTab>

          <AccordionTab
            header="Які є фічі пошуку та сортування?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Пошук за номером поїзда, станціями і датою. Сортування за часом відправлення, прибуття,
            тривалістю та номером. Комбіновані фільтри підтримуються.
          </AccordionTab>

          <AccordionTab
            header="Чи є ролі користувачів?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Мінімально: <b>admin</b> (повний доступ) та <b>user</b> (перегляд). Ролі розширюються
            через Guards/Decorators у NestJS.
          </AccordionTab>

          <AccordionTab
            header="Де розгорнуто застосунок?"
            headerClassName="body-20-semibold"
            contentClassName="body-16-regular"
          >
            Бекенд — на хмарі (Render.com), фронтенд — Next.js. Підключений логер, health-check та
            базові метрики.
          </AccordionTab>
        </Accordion>
      </div>
    </section>
  );
}
