'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { createStationAction } from '@/actions/dashboard/stations/stations';
import FormWatcher from '@/components/common/form/form-watcher';

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function AddStationDialog({ visible, onHide }: Props) {
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleDone() {
    setCode('');
    setName('');
    setSubmitted(false);
    onHide();
  }

  return (
    <Dialog
      header="Додати станцію"
      visible={visible}
      onHide={onHide}
      className="w-[520px] max-w-full"
    >
      <form
        action={createStationAction}
        onSubmit={() => setSubmitted(true)}
        className="flex flex-col gap-4"
      >
        <FormWatcher submitted={submitted} onDone={handleDone} />
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="body-16-semibold">
            Код станції
          </label>
          <InputText
            id="code"
            name="code"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="lvi"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="body-16-semibold">
            Назва станції
          </label>
          <InputText
            id="name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Lviv"
            required
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" label="Скасувати" onClick={onHide} text />
          <Button type="submit" label="Створити" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>
  );
}
