'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BoardCreatePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`/api/board/${id}`);
            const data = await res.json();

            setTitle(data.title);
            setContent(data.content);
            setLoading(false);
        }    

        fetchPost();
    }, [id]);

    return (
        <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6 space-y-4">
            <h1 className="text-2xl font-bold">글 등록</h1>
            <input className="w-full border rounded px-3 py-2" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2 h-40" placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex justify-end gap-2">
                <button onClick={() => router.back()} className="px-4 py-2 rounded bg-blue-600 text-white">
                    취소
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white">
                    등록
                </button>
            </div>
        </div>
    )
}