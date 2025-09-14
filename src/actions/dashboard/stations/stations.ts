'use server';

import { revalidatePath } from 'next/cache';
import { axiosPrivateServer, axiosPublicServer } from '@/lib/common/server/http';
import type {
  CreateStationDto,
  DeleteStationResponse,
  StationDTO,
} from '@/types/dashboard/stations';

export async function fetchStations(): Promise<ReadonlyArray<StationDTO>> {
  const res = await axiosPublicServer.get<ReadonlyArray<StationDTO>>('/stations', {
    responseType: 'json',
  });
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return [];
}

export async function createStationAction(formData: FormData): Promise<void> {
  const codeRaw = String(formData.get('code') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const code = codeRaw.toLowerCase();

  if (!code || !name) {
    return;
  }

  const payload: CreateStationDto = { code, name };
  console.log(payload);
  const res = await axiosPrivateServer.post('/stations', payload, { responseType: 'json' });
  console.log(res.data);
  if (res.status >= 200 && res.status < 300) {
    revalidatePath('/dashboard/stations');
    return;
  }
  revalidatePath('/dashboard/stations');
}

export async function deleteStationAction(formData: FormData): Promise<void> {
  const idRaw = String(formData.get('id') || '').trim();
  const id = Number(idRaw);
  if (!id || Number.isNaN(id)) {
    return;
  }
  const res = await axiosPrivateServer.delete<DeleteStationResponse>(`/stations/${id}`, {
    responseType: 'json',
  });
  if (res.status >= 200 && res.status < 300) {
    const _data: DeleteStationResponse = res.data;
    revalidatePath('/dashboard/stations');
    return;
  }
  revalidatePath('/dashboard/stations');
}
