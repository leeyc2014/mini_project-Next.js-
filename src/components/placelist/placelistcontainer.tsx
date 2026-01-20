'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import PlaceList from '@/components/placelist/placelist';
import Pagination from '@/components/paging';
import { Place } from '@/types/place';

interface Props {
    initialData: Place[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
}

export default function PlaceListContainer({ initialData, totalCount, pageSize, currentPage }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`/dashboard/listsearch?${params.toString()}`);
    };
    
    const hasNext = currentPage * pageSize < totalCount;

    return (
        <>
            <PlaceList data={initialData} />
            <div className="py-8 border-t border-gray-100">
                <Pagination currentPage={currentPage} hasNext={hasNext} totalCount={totalCount} pageSize={pageSize} onPageChange={handlePageChange} />
            </div>
        </>
    );
}
