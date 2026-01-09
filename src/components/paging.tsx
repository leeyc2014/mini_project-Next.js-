'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentPage: number;
  hasNext: boolean;
}

export default function Pagination({ currentPage, hasNext }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button disabled={currentPage === 1} onClick={() => goPage(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-40">
        이전
      </button>
      <span className="px-3 py-1 font-bold">
        {currentPage}
      </span>
      <button disabled={!hasNext} onClick={() => goPage(currentPage + 1)} className="px-3 py-1 border rounded disabled:opacity-40">
        다음
      </button>
    </div>
  );
}
