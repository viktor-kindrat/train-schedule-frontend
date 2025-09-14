'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import type { FormEvent as PRFormEvent } from 'primereact/ts-helpers';
import { createTripAction } from '@/actions/dashboard/trips/trips';
import type { StationDTO } from '@/types/dashboard/stations';
import { DAY_OPTIONS } from '@/constants/dashboard/common';
import { StopFormRow } from '@/types/dashboard/trips';
import { formatYYYYMMDD, normalizeTime } from '@/utils/common/time';
import FormWatcher from '@/components/common/form/form-watcher';

interface Props {
  visible: boolean;
  onHide: () => void;
  stations: ReadonlyArray<StationDTO>;
}

export default function AddTripDialog({ visible, onHide, stations }: Props) {
  const stationOptions = useMemo(
    () => stations.map(s => ({ label: s.name, value: s.code })),
    [stations]
  );

  const [trainNo, setTrainNo] = useState<string>('');
  const [days, setDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [stops, setStops] = useState<StopFormRow[]>([
    { stationCode: '', arrival: '', departure: '', platform: '' },
    { stationCode: '', arrival: '', departure: '', platform: '' },
  ]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    setTrainNo('');
    setDays([]);
    setStartDate(null);
    setEndDate(null);
    setStops([
      { stationCode: '', arrival: '', departure: '', platform: '' },
      { stationCode: '', arrival: '', departure: '', platform: '' },
    ]);
    setSubmitted(false);
  }, [visible]);

  function addStop() {
    setStops(prev => [...prev, { stationCode: '', arrival: '', departure: '', platform: '' }]);
  }
  function removeStop(index: number) {
    setStops(prev => prev.filter((_, i) => i !== index));
  }
  function updateStop(index: number, patch: Partial<StopFormRow>) {
    setStops(prev => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function handleDone() {
    setSubmitted(false);
    onHide();
  }

  const daysValue = days.join(',');
  const startDateValue = startDate ? formatYYYYMMDD(startDate) : '';
  const endDateValue = endDate ? formatYYYYMMDD(endDate) : '';

  const stopsJson = useMemo(() => {
    const normalized = stops.map((s, i, arr) => ({
      stationCode: s.stationCode.trim(),
      arrival: i === 0 ? null : normalizeTime(s.arrival) || null,
      departure: i === arr.length - 1 ? null : normalizeTime(s.departure) || null,
      platform: s.platform.trim() || null,
    }));
    return JSON.stringify(normalized);
  }, [stops]);

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

  function onStationChange(index: number) {
    return (e: DropdownChangeEvent) => {
      const next = e.value == null ? '' : `${e.value}`;
      updateStop(index, { stationCode: next });
    };
  }

  return (
    <Dialog header="Додати рейс" visible={visible} onHide={onHide} className="w-[760px] max-w-full">
      <form
        action={createTripAction}
        onSubmit={() => setSubmitted(true)}
        className="flex flex-col gap-4"
      >
        <FormWatcher submitted={submitted} onDone={handleDone} />

        <input type="hidden" name="days" value={daysValue} />
        <input type="hidden" name="startDate" value={startDateValue} />
        <input type="hidden" name="endDate" value={endDateValue} />
        <input type="hidden" name="stops" value={stopsJson} />

        <div className="flex flex-col gap-2">
          <label htmlFor="trainNo" className="body-16-semibold">
            Номер поїзда (опційно)
          </label>
          <InputText
            id="trainNo"
            name="trainNo"
            value={trainNo}
            onChange={e => setTrainNo(e.target.value)}
            placeholder="IC-123"
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

        <div className="flex flex-col gap-3">
          <div className="body-16-semibold">Зупинки</div>
          <div className="text-sm text-neutral-600">
            Додайте принаймні дві зупинки. Перша має мати час відправлення, остання — час прибуття.
          </div>

          {stops.map((s, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-sm" htmlFor={`station-${i}`}>
                  Станція
                </label>
                <Dropdown
                  id={`station-${i}`}
                  value={s.stationCode || null}
                  onChange={onStationChange(i)}
                  options={stationOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Оберіть станцію"
                  filter
                  showClear
                  required
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-sm" htmlFor={`arr-${i}`}>
                  Прибуття (HH:mm)
                </label>
                <InputMask
                  id={`arr-${i}`}
                  value={s.arrival}
                  onChange={e => updateStop(i, { arrival: e.value ?? '' })}
                  mask="99:99"
                  placeholder="HH:mm"
                  disabled={i === 0}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-sm" htmlFor={`dep-${i}`}>
                  Відправлення (HH:mm)
                </label>
                <InputMask
                  id={`dep-${i}`}
                  value={s.departure}
                  onChange={e => updateStop(i, { departure: e.value ?? '' })}
                  mask="99:99"
                  placeholder="HH:mm"
                  disabled={i === stops.length - 1}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm" htmlFor={`platform-${i}`}>
                  Платформа
                </label>
                <InputText
                  id={`platform-${i}`}
                  value={s.platform}
                  onChange={e => updateStop(i, { platform: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div className="flex items-end md:col-span-1">
                <Button
                  type="button"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  onClick={() => removeStop(i)}
                  aria-label="Видалити зупинку"
                />
              </div>
            </div>
          ))}

          <div>
            <Button type="button" label="Додати зупинку" icon="pi pi-plus" onClick={addStop} text />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" label="Скасувати" onClick={onHide} text />
          <Button type="submit" label="Створити" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>
  );
}
