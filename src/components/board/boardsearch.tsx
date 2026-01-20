'use client'

import { useState } from "react";

interface BoardSearchProps {
    onSearch: (term: string, type: string) => void;
}

export default function BoardSearch({ onSearch }: BoardSearchProps) { 
    const [searchType, setSearchType] = useState("title");
    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {
        onSearch(keyword, searchType);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 justify-between rounded-xl bg-white border p-4">
            <div className="flex gap-2">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                </select>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력" className="border rounded px-2 py-2 text-sm w-64" onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <button onClick={handleSearch} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
                검색
            </button>
        </div>
    );
}