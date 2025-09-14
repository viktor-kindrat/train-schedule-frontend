export interface TripStopDTO {
  stationCode: string;
  seq: number;
  arrival: string | null;
  departure: string | null;
  platform: string | null;
}

export interface TripDTO {
  id: number;
  trainNo: string | null;
  days: number[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  stopsCount: number;
}

export interface TripsListResponse {
  items: TripDTO[];
  total: number;
  page: number;
  pageSize: number;
}

export type TripsSort = 'trainNo' | 'firstDeparture';

export interface TripsQueryParams {
  page?: number;
  pageSize?: number;
  details?: boolean;
  trainNo?: string;
  stationCode?: string;
  activeOnDate?: string; // YYYY-MM-DD
  sort?: TripsSort;
}

export interface TripSearchResultItem {
  tripId: number;
  trainNo: string | null;
  from: { stationId: number; stationCode: string; departure: string };
  to: { stationId: number; stationCode: string; arrival: string };
  durationMinutes: number;
}

export interface CreateTripDto {
  trainNo: string | null;
  days: number[];
  startDate: string;
  endDate: string;
  stops: Array<{
    stationCode: string;
    arrival: string | null;
    departure: string | null;
    platform: string | null;
  }>;
}

export interface PatchUpdateCalendarDto {
  op: 'updateCalendar';
  trainNo?: string | null;
  days?: number[];
  startDate?: string;
  endDate?: string;
}

export interface PatchAddStopDto {
  op: 'addStop';
  afterSeq: number;
  stationCode: string;
  arrival: string | null;
  departure: string | null;
  platform: string | null;
}

export interface PatchRemoveStopDto {
  op: 'removeStop';
  seq: number;
}

export interface PatchMoveStopDto {
  op: 'moveStop';
  fromSeq: number;
  toSeq: number;
}

export interface PatchUpdateStopDto {
  op: 'updateStop';
  targetSeq: number;
  newArrival: string | null;
  newDeparture: string | null;
  newPlatform: string | null;
}

export type TripPatchDto =
  | PatchUpdateCalendarDto
  | PatchAddStopDto
  | PatchRemoveStopDto
  | PatchMoveStopDto
  | PatchUpdateStopDto;

export interface TripDetailsDTO {
  id: number;
  trainNo: string | null;
  days: number[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  stops: TripStopDTO[];
}

export type StopFormRow = Readonly<{
  stationCode: string;
  arrival: string;
  departure: string;
  platform: string;
}>;
