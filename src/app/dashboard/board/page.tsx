'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BoardList from "@/components/board/boardlist";
import BoardDetail from "@/components/board/boarddetail";
import BoardSearch from "@/components/board/boardsearch";

export default function BoardPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        router.replace('/dashboard/board', { scroll: false });
    }, []);

    const handleSearch = (term: string, type: string) => {
        setSearchTerm(term);
        setSearchType(type);
        setSelectedId(null);
        
        const params = new URLSearchParams();
        params.set('query', term);
        params.set('type', type);
        router.push(`/dashboard/board?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="flex flex-col gap-6">
                <BoardSearch onSearch={handleSearch} />
                <BoardList pageSize={10} selectedId={selectedId} onSelect={setSelectedId} onCreate={() => router.push("/dashboard/board/new")} searchTerm={searchTerm} searchType={searchType} />
            </div>
            <div>
                <BoardDetail postId={selectedId} />
            </div>
        </div>
    );
}
