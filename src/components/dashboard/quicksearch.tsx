'use client';

import { useState } from "react";

interface Place {
    id: number;
    fclty_nm: string;
    rdnmadr_nm: string;
    lnm_addr: string;
}

export default function QuickSearch({ onResult, }: { onResult: (results: Place[], keyword: string) => void; }) {
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setLoading(true);

        const res = await fetch(`/api/quicksearch?keyword=${keyword}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("QuickSearch response is not array:", data);
            setLoading(false);
            return;
        }

        onResult(data, keyword);
        setLoading(false);
    };

    return (
        <div className="rounded-xl bg-white border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">
                시설 이름으로 빠른 검색
            </h3>
            <div className="flex gap-3">
                <input type="text" placeholder="시설 이름을 입력하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="flex-1 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleSearch} disabled={loading} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                    {loading ? "검색중..." : "검색"}
                </button>
            </div>
        </div>
    );
}
