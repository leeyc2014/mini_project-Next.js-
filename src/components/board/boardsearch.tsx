'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function BoardSearch() { 
    const [searchType, setSearchType] = useState("title");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = async () => {
        const params = new URLSearchParams(searchParams.toString());

        if(keyword.trim()) {
            params.set("searchType", searchType);
            params.set("keyword", keyword);
            params.set("page", "1");
        }
        else {
            params.delete("searchType");
            params.delete("keyword");
            params.set("page", "1");
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 justify-between rounded-xl bg-white border p-4">
            <div className="flex gap-2">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                </select>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력" className="border rounded px-2 py-2 text-sm w-64" onKeyDown={(e) => e.key === "Enter" && handleSearch()}/>
            </div>
            <button onClick={handleSearch} disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
                {loading ? "검색중..." : "검색"}
            </button>
        </div>
    );
}