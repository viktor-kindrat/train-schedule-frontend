'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { deleteStationAction } from '@/actions/dashboard/stations/stations';

interface Props {
  visible: boolean;
  onHide: () => void;
  stationId: number | null;
  stationName: string | null;
}

export default function DeleteStationDialog({ visible, onHide, stationId, stationName }: Props) {
  return (
    <Dialog
      header="Підтвердження видалення"
      visible={visible}
      onHide={onHide}
      className="w-[480px] max-w-full"
    >
      <div className="body-16-regular mb-4">
        Видалити станцію {stationName || ''}? Цю дію не можна скасувати.
      </div>
      <form
        action={async (formData: FormData) => {
          await deleteStationAction(formData);
          onHide();
        }}
        className="flex items-center justify-end gap-2"
      >
        <input type="hidden" name="id" value={stationId ?? 0} />
        <Button type="button" label="Скасувати" onClick={onHide} text />
        <Button type="submit" label="Видалити" icon="pi pi-trash" severity="danger" />
      </form>
    </Dialog>
  );
}
