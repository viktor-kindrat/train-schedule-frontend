'use server';

import { revalidatePath } from 'next/cache';
import { axiosPrivateServer, axiosPublicServer } from '@/lib/common/server/http';
import type {
  TripsListResponse,
  TripsQueryParams,
  TripSearchResultItem,
  PatchUpdateCalendarDto,
  CreateTripDto,
  TripDetailsDTO,
} from '@/types/dashboard/trips';

export async function fetchTrips(params: TripsQueryParams): Promise<TripsListResponse> {
  const query: Record<string, string> = {};
  if (params.page) query.page = String(params.page);
  if (params.pageSize) query.pageSize = String(params.pageSize);
  if (params.details) query.details = String(params.details);
  if (params.trainNo) query.trainNo = params.trainNo;
  if (params.stationCode) query.stationCode = params.stationCode;
  if (params.activeOnDate) query.activeOnDate = params.activeOnDate;
  if (params.sort) query.sort = params.sort;

  const res = await axiosPublicServer.get<TripsListResponse>('/trips', {
    params: query,
    responseType: 'json',
  });
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return { items: [], total: 0, page: params.page || 1, pageSize: params.pageSize || 20 };
}

export async function fetchTripById(id: number): Promise<TripDetailsDTO | null> {
  const res = await axiosPublicServer.get<TripDetailsDTO>(`/trips/${id}`, { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return null;
}

export async function searchTrips(params: {
  from: string;
  to: string;
  date: string;
  time: string;
  limit?: number;
}): Promise<ReadonlyArray<TripSearchResultItem>> {
  const query: Record<string, string> = {
    from: params.from,
    to: params.to,
    date: params.date,
    time: params.time,
  };
  if (params.limit && params.limit > 0) query.limit = String(params.limit);

  const res = await axiosPublicServer.get<ReadonlyArray<TripSearchResultItem>>('/trips/search', {
    params: query,
    responseType: 'json',
  });
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return [];
}

export async function deleteTripAction(formData: FormData): Promise<void> {
  const idRaw = String(formData.get('id') || '').trim();
  const id = Number(idRaw);
  if (!id || Number.isNaN(id)) {
    return;
  }
  const res = await axiosPrivateServer.delete(`/trips/${id}`, { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    revalidatePath('/dashboard/trips');
    return;
  }
  revalidatePath('/dashboard/trips');
}

export async function updateTripCalendarAction(formData: FormData): Promise<void> {
  const idRaw = String(formData.get('id') || '').trim();
  const id = Number(idRaw);
  if (!id || Number.isNaN(id)) {
    return;
  }
  const trainNoRaw = formData.get('trainNo');
  const trainNo = trainNoRaw === null ? null : String(trainNoRaw).trim();
  const daysRaw = String(formData.get('days') || '').trim();
  const startDate = String(formData.get('startDate') || '').trim();
  const endDate = String(formData.get('endDate') || '').trim();

  const days = daysRaw
    ? daysRaw
        .split(',')
        .map(p => Number(p.trim()))
        .filter(n => !Number.isNaN(n) && n >= 1 && n <= 7)
    : [];

  const payload: PatchUpdateCalendarDto = { op: 'updateCalendar' };
  if (trainNo !== undefined) payload.trainNo = trainNo;
  if (days.length > 0) payload.days = days;
  if (startDate) payload.startDate = startDate;
  if (endDate) payload.endDate = endDate;

  const res = await axiosPrivateServer.patch(`/trips/${id}`, payload, { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    revalidatePath('/dashboard/trips');
    return;
  }
  revalidatePath('/dashboard/trips');
}
export async function createTripAction(formData: FormData): Promise<void> {
  const trainNoRaw = formData.get('trainNo');
  const trainNo = trainNoRaw === null ? null : String(trainNoRaw).trim() || null;

  const daysRaw = String(formData.get('days') || '').trim();
  const startDate = String(formData.get('startDate') || '').trim();
  const endDate = String(formData.get('endDate') || '').trim();
  const stopsRaw = String(formData.get('stops') || '[]');

  const days = daysRaw
    ? daysRaw
        .split(',')
        .map(p => Number(p.trim()))
        .filter(n => !Number.isNaN(n) && n >= 1 && n <= 7)
    : [];

  let stops: CreateTripDto['stops'] = [];
  try {
    const parsed: CreateTripDto['stops'] = JSON.parse(stopsRaw);
    stops = parsed
      .map(s => ({
        stationCode: String(s.stationCode || '')
          .trim()
          .toLowerCase(),
        arrival: s.arrival ? String(s.arrival) : null,
        departure: s.departure ? String(s.departure) : null,
        platform: s.platform ? String(s.platform) : null,
      }))
      .filter(s => Boolean(s.stationCode));
  } catch {
    console.log('Error parsing stops');
  }

  const payload: CreateTripDto = {
    trainNo,
    days,
    startDate,
    endDate,
    stops,
  };

  const res = await axiosPrivateServer.post('/trips', payload, { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    revalidatePath('/dashboard/trips');
    return;
  }
  revalidatePath('/dashboard/trips');
}

export async function updateTripAction(formData: FormData): Promise<void> {
  const idRaw = String(formData.get('id') || '').trim();
  const id = Number(idRaw);
  if (!id || Number.isNaN(id)) {
    return;
  }

  const trainNoRaw = formData.get('trainNo');
  const trainNo = trainNoRaw === null ? null : String(trainNoRaw).trim() || null;

  const daysRaw = String(formData.get('days') || '').trim();
  const startDate = String(formData.get('startDate') || '').trim();
  const endDate = String(formData.get('endDate') || '').trim();
  const stopsRaw = String(formData.get('stops') || '[]');

  const days = daysRaw
    ? daysRaw
        .split(',')
        .map(p => Number(p.trim()))
        .filter(n => !Number.isNaN(n) && n >= 1 && n <= 7)
    : [];

  let stops: CreateTripDto['stops'] = [];
  try {
    const parsed: CreateTripDto['stops'] = JSON.parse(stopsRaw);
    stops = parsed
      .map(s => ({
        stationCode: String(s.stationCode || '')
          .trim()
          .toLowerCase(),
        arrival: s.arrival ? String(s.arrival) : null,
        departure: s.departure ? String(s.departure) : null,
        platform: s.platform ? String(s.platform) : null,
      }))
      .filter(s => Boolean(s.stationCode));
  } catch {
    console.log('Error parsing stops');
  }

  const payload: CreateTripDto = {
    trainNo,
    days,
    startDate,
    endDate,
    stops,
  };

  const res = await axiosPrivateServer.put(`/trips/${id}`, payload, { responseType: 'json' });
  if (res.status >= 200 && res.status < 300) {
    revalidatePath('/dashboard/trips');
    return;
  }
  revalidatePath('/dashboard/trips');
}
