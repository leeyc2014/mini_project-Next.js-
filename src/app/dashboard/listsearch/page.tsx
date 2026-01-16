import Pagination from '@/components/paging';
import SearchFilter from '@/components/search/searchfilter';
import PlaceList from '@/components/placelist/placelist';

import { PlaceResponse } from '@/types/place';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PlacesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page || 1);
  const size = 10;

  const params = new URLSearchParams({
    ...resolvedParams,
    size: String(size),
  });

  const res = await fetch(
    `/api/placesearch?${params}`,
    { cache: 'no-store' }
  );

  const data: PlaceResponse = await res.json();

  return (
    <div className="min-h-screen">
      {/* 작은 화면: 필터를 상단에 노출 */}
      <section className="block md:hidden border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <SearchFilter />
        </div>
      </section>

      <div className="flex flex-col md:flex-row">
        {/* 큰 화면: 좌측 사이드바 */}
        <aside className="hidden md:block md:w-120 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <SearchFilter />
        </aside>

        {/* 우측 검색 결과 영역 */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {/* 헤더 */}
            <header className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">장소 검색</h1>
                <p className="text-gray-500 mt-1">총{' '}<span className="text-indigo-600 font-bold">{data.totalCount}</span>개의 장소를 찾았습니다.</p>
              </div>
            </header>

            {/* 🔥 검색 결과 (Client Component) */}
            <PlaceList data={data.data} />

            {/* 페이지네이션 */}
            <div className="py-8 border-t border-gray-100">
              <Pagination currentPage={page} hasNext={page * size < data.totalCount} totalCount={data.totalCount} pageSize={size} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
