import Pagination from '@/components/paging';
import SearchFilter from '@/components/searchFilter';
import { PlaceResponse } from '@/types/place';

import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PlacesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page || 1);
  const size = 10;

  const params = new URLSearchParams({ ...resolvedParams, size: String(size) });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/placesearch?${params}`,
    { cache: 'no-store' }
  );

  const data: PlaceResponse = await res.json();

  return (
    <div className="flex flex-row w-full">
      <SearchFilter />

      <div className="p-5 container">
        <h1 className="text-3xl font-bold mb-4">검색 결과</h1>

        <ul className="grid grid-cols-2 gap-4">
          {data.data.map((place, idx) => (
            <li key={idx} className="border p-4 rounded shadow-sm hover:shadow-md transition">
              <p className="font-bold text-lg mb-1">{place.fclty_nm}</p>
              <p className="text-sm text-gray-600">{place.rdnmadr_nm ?? '-'}</p>
              <p className="text-sm text-gray-600">{place.lnm_addr ?? '-'}</p>
            </li>
          ))}
        </ul>
        <Pagination currentPage={page} hasNext={data.data.length === size} />
      </div>
    </div>
  );
}
