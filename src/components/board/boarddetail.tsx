'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { BoardPost } from "@/types/board";

import BoardComment from "./boardcomment";

interface Props {
    postId: number | null;
}

export default function BoardDetail({ postId }: Props) {
    const { data: session } = useSession();
    const [detail, setDetail] = useState<BoardPost | null>(null);
    const router = useRouter();

    const isOwner = String(session?.user?.id) === String(detail?.author_id);
    const admin = session?.user?.role === "admin";


    useEffect(() => {
        if (!postId) {
            setDetail(null);
            return;
        }

        const fetchDetail = async () => {
            try {
                const resPost = await fetch(`/api/board/${postId}`);
                const postData: BoardPost = await resPost.json();
                setDetail(postData);
            }
            catch (err) {
                console.error("게시글 상세 불러오기 실패:", err);
                setDetail(null);
            }
        };

        fetchDetail();
    }, [postId]);

    const handleDeletePost = async () => {
        if (!confirm("삭제하시겠습니까?")) return;

        await fetch(`/api/board/${detail?.id}`, {
            method: "DELETE",
        });
        window.location.href = "/dashboard/board";
    }

    if (!detail) {
        return (
            <div className="rounded-xl bg-white border p-8 text-center text-gray-400">
                게시글을 선택하세요
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white border p-6 space-y-4">
            <h2 className="text-xl font-bold">{detail.title}</h2>
            <p className="text-sm text-gray-500">
                {detail.author_name} · {new Date(detail.created_at).toLocaleString()}
            </p>

            <div className="whitespace-pre-line text-sm">{detail.content}</div>

            {(isOwner || admin) && (
                <div className="flex gap-2 justify-end">
                    {isOwner && (
                        <>
                            <button onClick={() => router.push(`/dashboard/board/edit/${detail.id}`)} className="px-3 py-1 text-sm rounded cursor-pointer">
                                수정
                            </button>
                            <button onClick={handleDeletePost} className="px-3 py-1 text-sm hover:text-red-600 cursor-pointer">
                                삭제
                            </button>
                        </>
                    )}
                    {admin && !isOwner && (
                        <button onClick={handleDeletePost} className="px-3 py-1 text-sm hover:text-red-600 cursor-pointer">
                            삭제
                        </button>
                    )}
                </div>
            )}

            <BoardComment boardId={detail.id} />
        </div>
    );
}
