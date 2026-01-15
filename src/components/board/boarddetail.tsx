'use client';

import { useState, useEffect } from "react";
import { BoardPost } from "@/types/board";

export default function BoardDetail({ post, }: { post: BoardPost | null; }) {
    const [detail, setDetail] = useState<BoardPost | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!post?.id) {
            setDetail(null);
            return;
        }
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${post.id}`)
            .then(res => res.json())
            .then(data => setDetail(data))
            .finally(() => setLoading(false));
    }, [post?.id]);

    if (!post) {
        return (
            <div className="rounded-xl bg-white border p-8 text-center text-gray-400">
                게시글을 선택하세요
            </div>
        );
    }

    if (loading || !detail) {
        return (
            <div className="rounded-xl bg-white border p-8 text-center text-gray-400"> 
                로딩 중...
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white border shadow-sm p-6 space-y-4">
            <div>
                <h2 className="text-xl font-bold">{detail.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {detail.author_name} · {new Date(detail.created_at).toLocaleString()}
                </p>
            </div>
            <hr />
            <div className="text-sm leading-relaxed whitespace-pre-line">
                {detail.content}
            </div>
            <hr />
            {/* 댓글 영역 placeholder */}
            <div className="text-sm text-gray-400">
                댓글
            </div>

            {/* 작성자만 보이게 */}
            <div className="flex justify-end gap-2">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                    수정
                </button>
                <button className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50">
                    삭제
                </button>
            </div>
        </div>
    );
}
