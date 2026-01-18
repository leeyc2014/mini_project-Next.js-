'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BoardEditPage() {
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
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        await fetch(`/api/board/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content,
            }),
        });

        router.push("/dashboard/board");
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6 space-y-4">
            <h1 className="text-xl font-bold">글 수정</h1>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2 h-40" value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex justify-end gap-2">
                <button onClick={() => router.back()} className="px-4 py-2 border rounded cursor-pointer">
                    취소
                </button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                    저장
                </button>
            </div>
        </div>
    );
}
