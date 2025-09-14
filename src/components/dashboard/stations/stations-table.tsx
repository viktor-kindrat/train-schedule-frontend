'use client';

import { useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { StationDTO } from '@/types/dashboard/stations';
import { useUserInfo } from '@/hooks/common/use-user-info';
import AddStationDialog from './add-station-dialog';
import DeleteStationDialog from './delete-station-dialog';

interface Props {
  stations: ReadonlyArray<StationDTO>;
}

export default function StationsTable({ stations }: Props) {
  const { user } = useUserInfo();
  const isAdmin = user?.role === 'admin';

  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  function onAskDelete(id: number, name: string) {
    setSelectedId(id);
    setSelectedName(name);
    setDeleteVisible(true);
  }

  const header = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div className="body-20-semibold">Станції</div>
        <div>
          <Button
            label="Додати"
            icon="pi pi-plus"
            onClick={() => setAddVisible(true)}
            disabled={!isAdmin}
          />
        </div>
      </div>
    ),
    [isAdmin]
  );

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <DataTable
        value={[...stations]}
        header={header}
        stripedRows
        paginator
        rows={10}
        className="w-full"
      >
        <Column field="id" header="ID" style={{ width: '100px' }} />
        <Column field="code" header="Код" style={{ width: '160px' }} />
        <Column field="name" header="Назва" />
        <Column
          header="Дії"
          body={(row: StationDTO) => (
            <div className="flex items-center gap-2">
              <Button
                label="Видалити"
                icon="pi pi-trash"
                severity="danger"
                text
                disabled={!isAdmin}
                onClick={() => onAskDelete(row.id, row.name)}
              />
            </div>
          )}
          style={{ width: '220px' }}
        />
      </DataTable>

      <AddStationDialog visible={addVisible} onHide={() => setAddVisible(false)} />
      <DeleteStationDialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        stationId={selectedId}
        stationName={selectedName}
      />
    </div>
  );
}
