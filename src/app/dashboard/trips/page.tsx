import { fetchTrips } from '@/actions/dashboard/trips/trips';
import { fetchStations } from '@/actions/dashboard/stations/stations';
import TripsFiltersBar from '@/components/dashboard/trips/trips-filters-bar';
import TripsTable from '@/components/dashboard/trips/trips-table';
import type { TripsQueryParams } from '@/types/dashboard/trips';

function readBoolean(value: string | null): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsedParams = await searchParams;

  const page =
    Number(Array.isArray(parsedParams.page) ? parsedParams.page[0] : parsedParams.page) || 1;
  const pageSize =
    Number(
      Array.isArray(parsedParams.pageSize) ? parsedParams.pageSize[0] : parsedParams.pageSize
    ) || 20;
  const detailsRaw =
    (Array.isArray(parsedParams.details) ? parsedParams.details[0] : parsedParams.details) ||
    'false';
  const details = readBoolean(detailsRaw) ?? false;
  const trainNo =
    (Array.isArray(parsedParams.trainNo) ? parsedParams.trainNo[0] : parsedParams.trainNo) ||
    undefined;
  const stationCode =
    (Array.isArray(parsedParams.stationCode)
      ? parsedParams.stationCode[0]
      : parsedParams.stationCode) || undefined;
  const activeOnDate =
    (Array.isArray(parsedParams.activeOnDate)
      ? parsedParams.activeOnDate[0]
      : parsedParams.activeOnDate) || undefined;
  const sortRaw = Array.isArray(parsedParams.sort) ? parsedParams.sort[0] : parsedParams.sort;
  const sort: TripsQueryParams['sort'] | undefined =
    sortRaw === 'trainNo' || sortRaw === 'firstDeparture' ? sortRaw : undefined;

  const params: TripsQueryParams = {
    page,
    pageSize,
    details,
    trainNo,
    stationCode,
    activeOnDate,
    sort,
  };
  const data = await fetchTrips(params);
  const stations = await fetchStations();

  return (
    <div className="mx-auto w-full max-w-[var(--container-7xl)] px-2 py-4 md:px-4 md:py-6">
      <h1 className="headline-2 mb-4">Рейси</h1>
      <TripsFiltersBar stations={stations} />
      <TripsTable
        items={data.items}
        total={data.total}
        page={data.page}
        pageSize={data.pageSize}
        stations={stations}
      />
    </div>
  );
}
