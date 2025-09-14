import { fetchStations } from '@/actions/dashboard/stations/stations';
import StationsTable from '@/components/dashboard/stations/stations-table';

export const dynamic = 'force-dynamic';

export default async function StationsPage() {
  const stations = await fetchStations();

  return (
    <div className="mx-auto w-full max-w-[var(--container-7xl)] px-2 py-4 md:px-4 md:py-6">
      <h1 className="headline-2 mb-4">Станції</h1>
      <StationsTable stations={stations} />
    </div>
  );
}
