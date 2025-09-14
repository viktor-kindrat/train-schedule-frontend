'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { deleteTripAction } from '@/actions/dashboard/trips/trips';

interface Props {
  visible: boolean;
  onHide: () => void;
  tripId: number | null;
  trainNo: string | null;
}

export default function DeleteTripDialog({ visible, onHide, tripId, trainNo }: Props) {
  return (
    <Dialog
      header="Підтвердження видалення"
      visible={visible}
      onHide={onHide}
      className="w-[520px] max-w-full"
    >
      <div className="body-16-regular mb-4">Видалити рейс {trainNo || ''}?</div>
      <form
        action={async (formData: FormData) => {
          await deleteTripAction(formData);
          onHide();
        }}
        className="flex items-center justify-end gap-2"
      >
        <input type="hidden" name="id" value={tripId ?? 0} />
        <Button type="button" label="Скасувати" onClick={onHide} text />
        <Button type="submit" label="Видалити" icon="pi pi-trash" severity="danger" />
      </form>
    </Dialog>
  );
}
