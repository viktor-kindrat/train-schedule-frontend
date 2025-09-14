'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask';
import type { StationDTO } from '@/types/dashboard/stations';

import type { FormEvent as PRFormEvent } from 'primereact/ts-helpers';
import { formatYYYYMMDD, normalizeTime, parseYYYYMMDD } from '@/utils/common/time';

interface Props {
  stations: ReadonlyArray<StationDTO>;
}

export default function TripsSearchForm({ stations }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [from, setFrom] = useState<string>(sp.get('from') || '');
  const [to, setTo] = useState<string>(sp.get('to') || '');
  const [date, setDate] = useState<Date | null>(parseYYYYMMDD(sp.get('date')));
  const [time, setTime] = useState<string>(sp.get('time') || '');
  const [limit, setLimit] = useState<number>(Number(sp.get('limit') || '50'));

  const stationOptions = useMemo(
    () => stations.map(s => ({ label: s.name, value: s.code })),
    [stations]
  );

  function onStationFromChange(e: DropdownChangeEvent) {
    const next = e.value == null ? '' : `${e.value}`;
    setFrom(next);
  }

  function onStationToChange(e: DropdownChangeEvent) {
    const next = e.value == null ? '' : `${e.value}`;
    setTo(next);
  }

  function onDateChange(e: PRFormEvent<Date | null>) {
    setDate(e.value instanceof Date ? e.value : null);
  }

  function onTimeChange(e: InputMaskChangeEvent) {
    setTime(e.value ?? '');
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('from', from);
    params.set('to', to);
    const dateStr = date ? formatYYYYMMDD(date) : '';
    if (dateStr) params.set('date', dateStr);
    const timeStr = normalizeTime(time);
    if (timeStr) params.set('time', timeStr);
    if (limit) params.set('limit', String(limit));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-5"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="from" className="body-16-semibold">
          Зі станції
        </label>
        <Dropdown
          id="from"
          value={from || null}
          onChange={onStationFromChange}
          options={stationOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Оберіть станцію"
          filter
          showClear
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="to" className="body-16-semibold">
          До станції
        </label>
        <Dropdown
          id="to"
          value={to || null}
          onChange={onStationToChange}
          options={stationOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Оберіть станцію"
          filter
          showClear
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="body-16-semibold">
          Дата
        </label>
        <Calendar
          id="date"
          value={date}
          onChange={onDateChange}
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          readOnlyInput
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="time" className="body-16-semibold">
          Час після
        </label>
        <InputMask
          id="time"
          value={time}
          onChange={onTimeChange}
          mask="99:99"
          placeholder="HH:mm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="limit" className="body-16-semibold">
          Ліміт
        </label>
        <input
          id="limit"
          type="number"
          value={String(limit)}
          onChange={e => setLimit(Number(e.target.value || '50'))}
          className="p-inputtext p-component"
        />
      </div>
      <div className="flex items-center justify-end md:col-span-5">
        <Button type="submit" label="Шукати" icon="pi pi-search" />
      </div>
    </form>
  );
}
