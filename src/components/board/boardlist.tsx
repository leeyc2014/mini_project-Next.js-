'use client';

import { useState, useEffect } from "react";
import { BoardPost } from "@/types/board";
import Pagination from "@/components/paging";

interface Props {
    pageSize: number;
    selectedId: number | null;
    onSelect: (id: number) => void;
    onCreate: () => void;
    searchTerm: string;
    searchType: string;
}

export default function BoardList({ pageSize, selectedId, onSelect, onCreate, searchTerm, searchType }: Props) {
    const [posts, setPosts] = useState<BoardPost[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchType]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                const params = new URLSearchParams();
                params.set("page", String(currentPage));
                params.set("limit", String(pageSize));
                if (searchTerm.trim()) {
                    params.set("keyword", searchTerm);
                    params.set("searchType", searchType);
                }

                const res = await fetch(`/api/board?${params.toString()}`);
                const data = await res.json();

                setPosts(data.items || []);
                setTotalCount(data.total || 0);
            } 
            catch (err) {
                console.error("게시글 불러오기 실패:", err);
                setPosts([]);
                setTotalCount(0);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, pageSize, searchTerm, searchType]);

    return (
        <div className="rounded-xl bg-white border shadow-sm overflow-hidden">
            {loading && <div className="p-4 text-gray-500 text-center">로딩 중...</div>}
            {!loading && posts.length === 0 && <div className="p-4 text-gray-500 text-center">게시글이 없습니다.</div>}
            <ul className="divide-y">
                {posts.map((post) => (
                    <li key={post.id} onClick={() => onSelect(post.id)} className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${selectedId === post.id ? "bg-blue-50" : ""}`}>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{post.author_name}</span>
                            <span>{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-end px-4 py-2 border-t">
                <button onClick={onCreate} className="rounded-md bg-blue-600 px-4 py-2 mt-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
                    글등록
                </button>
            </div>
            <div className="p-3 text-center text-sm text-gray-400">
                <Pagination currentPage={currentPage} hasNext={currentPage * pageSize < totalCount} totalCount={totalCount} pageSize={pageSize} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
