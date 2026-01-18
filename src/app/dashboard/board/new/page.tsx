'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardCreatePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        await fetch("/api/board", {
            method: "POST",
            body: JSON.stringify({ title, content }),
        });

        router.push("/dashboard/board");
    };

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