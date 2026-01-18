'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
    id: number;
    title: string;
    author_name: string;
    created_at: string;
}

export default function BoardView() {
    const [data, setData] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/boardview");
            const json = await res.json();
            setData(json);
            setLoading(false);
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white border p-6">
                로딩중...
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white border shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">최근 게시물</h3>
            </div>

            {data?.length === 0 ? (
                <p className="text-sm text-gray-400">
                    게시글이 없습니다.
                </p>
            ) : (
                <ul className="divide-y">
                    {data?.map(post => (
                        <li key={post.id} className="py-3">
                            <Link href={`/dashboard/board`} className="block hover:bg-gray-50 rounded px-2 py-1">
                                <p className="font-medium text-gray-900 truncate">
                                    {post.title}
                                </p>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{post.author_name}</span>
                                    <span>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
