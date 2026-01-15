'use client'

import { useState } from "react";
import { BoardPost } from "@/types/board";

interface Props {
    onResult: (posts: BoardPost[]) => void;
}

export default function BoardSearch({ onResult, }:  Props) {
    const [searchType, setSearchType] = useState("title");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board?searchType=${searchType}&keyword=${keyword}&page=1`);
        const data = await res.json();

        onResult(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 justify-between rounded-xl bg-white border p-4">
            <div className="flex gap-2">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                </select>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력" className="border rounded px-2 py-2 text-sm w-64" />
            </div>
            <button onClick={handleSearch} disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
                {loading ? "검색중..." : "검색"}
            </button>
        </div>
    );
}