'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import type { FormEvent as PRFormEvent } from 'primereact/ts-helpers';
import type { TripsSort } from '@/types/dashboard/trips';

import type { StationDTO } from '@/types/dashboard/stations';
import { formatYYYYMMDD, parseYYYYMMDD } from '@/utils/common/time';
import { TRIPS_SORT_OPTIONS } from '@/constants/dashboard/trips';

interface Props {
  stations: ReadonlyArray<StationDTO>;
}

export default function TripsFiltersBar({ stations }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [trainNo, setTrainNo] = useState<string>(sp.get('trainNo') || '');
  const [stationCode, setStationCode] = useState<string>(sp.get('stationCode') || '');
  const [activeOnDate, setActiveOnDate] = useState<Date | null>(
    parseYYYYMMDD(sp.get('activeOnDate'))
  );

  const sortParam = sp.get('sort');
  const initialSort: TripsSort | undefined =
    sortParam === 'trainNo' || sortParam === 'firstDeparture' ? sortParam : undefined;
  const [sort, setSort] = useState<TripsSort | undefined>(initialSort);

  const stationOptions = useMemo(
    () => stations.map(s => ({ label: s.name, value: s.code })),
    [stations]
  );

  function onStationChange(e: DropdownChangeEvent) {
    const next = e.value == null ? '' : `${e.value}`;
    setStationCode(next);
  }

  function onDateChange(e: PRFormEvent<Date | null>) {
    setActiveOnDate(e.value instanceof Date ? e.value : null);
  }

  function toTripsSort(value: string): TripsSort | undefined {
    return value === 'trainNo' || value === 'firstDeparture' ? value : undefined;
  }

  function onSortChange(e: DropdownChangeEvent) {
    const raw = e.value == null ? '' : `${e.value}`;
    setSort(raw ? toTripsSort(raw) : undefined);
  }

  function applyFilters() {
    const params = new URLSearchParams(sp.toString());
    params.set('page', '1');
    if (trainNo) params.set('trainNo', trainNo);
    else params.delete('trainNo');
    if (stationCode) params.set('stationCode', stationCode);
    else params.delete('stationCode');
    const dateStr = activeOnDate ? formatYYYYMMDD(activeOnDate) : '';
    if (dateStr) params.set('activeOnDate', dateStr);
    else params.delete('activeOnDate');
    if (sort) params.set('sort', sort);
    else params.delete('sort');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <label className="body-16-semibold" htmlFor="trainNo">
          Номер поїзда
        </label>
        <InputText
          id="trainNo"
          value={trainNo}
          onChange={e => setTrainNo(e.target.value)}
          placeholder="IC-123"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="body-16-semibold" htmlFor="stationCode">
          Станція
        </label>
        <Dropdown
          id="stationCode"
          value={stationCode || null}
          onChange={onStationChange}
          options={stationOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Оберіть станцію"
          filter
          showClear
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="body-16-semibold" htmlFor="activeOnDate">
          Дата активності
        </label>
        <Calendar
          id="activeOnDate"
          value={activeOnDate}
          onChange={onDateChange}
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          readOnlyInput
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="body-16-semibold" htmlFor="sort">
          Сортування
        </label>
        <Dropdown
          id="sort"
          value={sort}
          onChange={onSortChange}
          options={TRIPS_SORT_OPTIONS}
          placeholder="Не вибрано"
          showClear
        />
      </div>
      <div className="md:self-end">
        <Button label="Застосувати" icon="pi pi-filter" onClick={applyFilters} />
      </div>
    </div>
  );
}
