import { searchTrips } from '@/actions/dashboard/trips/trips';
import { fetchStations } from '@/actions/dashboard/stations/stations';
import TripsSearchForm from '@/components/dashboard/trips/trips-search-form';
import type { TripSearchResultItem } from '@/types/dashboard/trips';

export const dynamic = 'force-dynamic';

export default async function TripsSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsedParams = await searchParams;
  const from = (Array.isArray(parsedParams.from) ? parsedParams.from[0] : parsedParams.from) || '';
  const to = (Array.isArray(parsedParams.to) ? parsedParams.to[0] : parsedParams.to) || '';
  const date = (Array.isArray(parsedParams.date) ? parsedParams.date[0] : parsedParams.date) || '';
  const time = (Array.isArray(parsedParams.time) ? parsedParams.time[0] : parsedParams.time) || '';
  const limit =
    Number(Array.isArray(parsedParams.limit) ? parsedParams.limit[0] : parsedParams.limit) || 50;

  const ready = Boolean(from && to && date && time);
  const results: ReadonlyArray<TripSearchResultItem> = ready
    ? await searchTrips({ from, to, date, time, limit })
    : [];

  const stations = await fetchStations();

  return (
    <div className="mx-auto w-full max-w-[var(--container-7xl)] px-2 py-4 md:px-4 md:py-6">
      <h1 className="headline-2 mb-4">Пошук відправлень</h1>
      <TripsSearchForm stations={stations} />

      {ready && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {results.length === 0 ? (
            <div className="body-16-regular text-neutral-600">Нічого не знайдено</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-neutral-600">
                  <th className="py-2">Trip ID</th>
                  <th className="py-2">Номер</th>
                  <th className="py-2">Зі</th>
                  <th className="py-2">Відправлення</th>
                  <th className="py-2">До</th>
                  <th className="py-2">Прибуття</th>
                  <th className="py-2">Тривалість, хв</th>
                </tr>
              </thead>
              <tbody>
                {results.map(item => (
                  <tr
                    key={`${item.tripId}-${item.from.stationId}-${item.to.stationId}`}
                    className="border-t"
                  >
                    <td className="py-2">{item.tripId}</td>
                    <td className="py-2">{item.trainNo ?? ''}</td>
                    <td className="py-2">{item.from.stationCode}</td>
                    <td className="py-2">{item.from.departure}</td>
                    <td className="py-2">{item.to.stationCode}</td>
                    <td className="py-2">{item.to.arrival}</td>
                    <td className="py-2">{item.durationMinutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
