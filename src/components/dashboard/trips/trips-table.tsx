'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import type { DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { TripDTO } from '@/types/dashboard/trips';
import type { StationDTO } from '@/types/dashboard/stations';
import { useUserInfo } from '@/hooks/common/use-user-info';
import EditTripDialog from './edit-trip-dialog';
import DeleteTripDialog from './delete-trip-dialog';
import AddTripDialog from '@/components/dashboard/trips/add-trip-dialog';
import { DAY_NAMES_UA } from '@/constants/dashboard/common';

interface Props {
  items: ReadonlyArray<TripDTO>;
  total: number;
  page: number;
  pageSize: number;
  stations: ReadonlyArray<StationDTO>;
}

export default function TripsTable({ items, total, page, pageSize, stations }: Props) {
  const { user } = useUserInfo();

  const isAdmin = useMemo<boolean>(() => user?.role === 'admin', [user?.role]);

  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<TripDTO | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function onAskEdit(trip: TripDTO) {
    setSelectedTrip(trip);
    setEditVisible(true);
  }
  function onAskDelete(trip: TripDTO) {
    setSelectedTrip(trip);
    setDeleteVisible(true);
  }

  const header = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div className="body-20-semibold">Рейси</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-600">Всього: {total}</div>
          <Button
            label="Додати"
            icon="pi pi-plus"
            onClick={() => setAddVisible(true)}
            disabled={!isAdmin}
          />
        </div>
      </div>
    ),
    [total, isAdmin]
  );

  function onPageChange(event: DataTablePageEvent) {
    const newPage = (event.page ?? Math.floor(event.first / event.rows)) + 1;
    const newPageSize = event.rows;
    const params = new URLSearchParams(sp.toString());
    params.set('page', String(newPage));
    params.set('pageSize', String(newPageSize));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <DataTable
        value={[...items]}
        header={header}
        stripedRows
        paginator
        rows={pageSize}
        first={(page - 1) * pageSize}
        totalRecords={total}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPage={onPageChange}
        className="w-full"
      >
        <Column field="id" header="ID" style={{ width: '90px' }} />
        <Column field="trainNo" header="Номер" style={{ width: '140px' }} />
        <Column
          header="Дні"
          body={(row: TripDTO) => row.days.map(d => DAY_NAMES_UA[d] ?? String(d)).join(', ')}
          style={{ width: '160px' }}
        />
        <Column
          header="Актуально з ... по"
          body={(row: TripDTO) => `${row.startDate} - ${row.endDate}`}
        />
        <Column
          header="Зупинки"
          body={(row: TripDTO) => row.stopsCount}
          style={{ width: '120px' }}
        />
        <Column
          header="Дії"
          body={(row: TripDTO) => (
            <div className="flex items-center gap-2">
              <Button
                key={`add-${Number(isAdmin)}`}
                label="Редагувати"
                icon="pi pi-pencil"
                text
                disabled={!isAdmin}
                onClick={() => onAskEdit(row)}
              />
              <Button
                label="Видалити"
                icon="pi pi-trash"
                severity="danger"
                text
                disabled={!isAdmin}
                onClick={() => onAskDelete(row)}
              />
            </div>
          )}
          style={{ width: '260px' }}
        />
      </DataTable>

      <EditTripDialog
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        trip={selectedTrip}
        stations={stations}
      />
      <DeleteTripDialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        tripId={selectedTrip?.id ?? null}
        trainNo={selectedTrip?.trainNo ?? null}
      />
      <AddTripDialog visible={addVisible} onHide={() => setAddVisible(false)} stations={stations} />
    </div>
  );
}
