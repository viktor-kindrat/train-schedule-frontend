'use client';

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import type { FormEvent as PRFormEvent } from 'primereact/ts-helpers';
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { updateTripCalendarAction } from '@/actions/dashboard/trips/trips';
import type { TripDTO } from '@/types/dashboard/trips';
import { DAY_OPTIONS } from '@/constants/dashboard/common';
import { formatYYYYMMDD } from '@/utils/common/time';

interface Props {
  visible: boolean;
  onHide: () => void;
  trip: TripDTO | null;
}

export default function EditTripCalendarDialog({ visible, onHide, trip }: Props) {
  const [trainNo, setTrainNo] = useState<string>('');
  const [days, setDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (trip) {
      setTrainNo(trip.trainNo || '');
      setDays([...trip.days]);
      setStartDate(trip.startDate ? new Date(trip.startDate + 'T00:00:00Z') : null);
      setEndDate(trip.endDate ? new Date(trip.endDate + 'T00:00:00Z') : null);
    }
  }, [trip]);

  const daysValue = days.join(',');
  const startDateValue = startDate ? formatYYYYMMDD(startDate) : '';
  const endDateValue = endDate ? formatYYYYMMDD(endDate) : '';

  function onDaysChange(e: MultiSelectChangeEvent) {
    const value = Array.isArray(e.value) ? e.value.map(Number) : [];
    setDays(value);
  }

  function onStartDateChange(e: PRFormEvent<Date | null>) {
    setStartDate(e.value instanceof Date ? e.value : null);
  }

  function onEndDateChange(e: PRFormEvent<Date | null>) {
    setEndDate(e.value instanceof Date ? e.value : null);
  }

  return (
    <Dialog
      header="Редагувати розклад (календар)"
      visible={visible}
      onHide={onHide}
      className="w-[640px] max-w-full"
    >
      {trip && (
        <form
          action={async (formData: FormData) => {
            await updateTripCalendarAction(formData);
            onHide();
          }}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={trip.id} />
          <input type="hidden" name="days" value={daysValue} />
          <input type="hidden" name="startDate" value={startDateValue} />
          <input type="hidden" name="endDate" value={endDateValue} />

          <div className="flex flex-col gap-2">
            <label htmlFor="trainNo" className="body-16-semibold">
              Номер поїзда
            </label>
            <InputText
              id="trainNo"
              name="trainNo"
              value={trainNo}
              onChange={e => setTrainNo(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="body-16-semibold">Дні курсування</label>
            <MultiSelect
              value={days}
              onChange={onDaysChange}
              options={[...DAY_OPTIONS]}
              optionLabel="label"
              optionValue="value"
              placeholder="Оберіть дні"
              display="chip"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="body-16-semibold">Початок дії</label>
              <Calendar
                value={startDate}
                onChange={onStartDateChange}
                dateFormat="yy-mm-dd"
                showIcon
                showButtonBar
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="body-16-semibold">Кінець дії</label>
              <Calendar
                value={endDate}
                onChange={onEndDateChange}
                dateFormat="yy-mm-dd"
                showIcon
                showButtonBar
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" label="Скасувати" onClick={onHide} text />
            <Button type="submit" label="Зберегти" icon="pi pi-check" />
          </div>
        </form>
      )}
    </Dialog>
  );
}
