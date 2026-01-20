'use client';

import { useState } from 'react';

interface Props {
    currentPage: number;
    hasNext: boolean;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, hasNext, totalCount, pageSize, onPageChange }: Props) {
    const [inputPage, setInputPage] = useState('');

    const totalPages = Math.ceil(totalCount / pageSize);

    const goPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    return (
        <div className="flex flex-col items-center gap-3 mt-6">
            <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => goPage(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-40">이전</button>
                <span className="px-3 py-1 font-bold">{currentPage} / {totalPages || 1}</span>
                <button disabled={!hasNext} onClick={() => goPage(currentPage + 1)} className="px-3 py-1 border rounded disabled:opacity-40">다음</button>
            </div>
            <div className="flex gap-2 items-center text-sm">
                <input type="number" min={1} max={totalPages} value={inputPage} onChange={(e) => setInputPage(e.target.value)} className="w-20 border px-2 py-1 rounded" placeholder="페이지" onKeyDown={(e) => { if (e.key === 'Enter') { const page = Number(inputPage); if (!isNaN(page)) goPage(page); }}} />
                <button onClick={() => { const page = Number(inputPage); if (!isNaN(page)) goPage(page); }} className="px-3 py-1 border rounded cursor-pointer">이동</button>
            </div>
        </div>
    );
}
