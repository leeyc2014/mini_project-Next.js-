'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Comment {
    id: number;
    parent_id: number | null;
    content: string;
    author_id: string;
    author_name: string;
    created_at: string;
    is_deleted: number;
}

export default function BoardComment({ boardId }: { boardId: number }) {
    const { data: session } = useSession();

    const [comments, setComments] = useState<Comment[]>([]);

    const [newText, setNewText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [editText, setEditText] = useState("");

    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    /* 댓글 목록 로드 */
    const load = async () => {
        const res = await fetch(
            `/api/board/${boardId}/comment`
        );
        setComments(await res.json());
    };

    useEffect(() => {
        load();
    }, [boardId]);

    /* 댓글 / 대댓글 작성 */
    const submit = async () => {
        const content = replyTo ? replyText : newText;
        if (!content.trim()) return;

        await fetch(
            `/api/board/${boardId}/comment`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    parent_id: replyTo,
                }),
            }
        );

        setNewText("");
        setReplyText("");
        setReplyTo(null);
        load();
    };

    /* 댓글 수정 */
    const update = async (id: number) => {
        if (!editText.trim()) return;

        await fetch(
            `/api/comment/${id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editText }),
            }
        );

        setEditId(null);
        setEditText("");
        load();
    };

    /* 댓글 삭제 (소프트 삭제) */
    const remove = async (id: number) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        await fetch(
            `/api/comment/${id}`,
            {
                method: "DELETE",
            }
        );

        load();
    };

    /* 댓글 렌더링 (재귀) */
    const render = (parentId: number | null, depth = 0) =>
        comments.filter(c => c.parent_id === parentId).map(c => (
            <div key={c.id} className="py-2" style={{ marginLeft: depth * 24 }}>
                <div className="text-sm font-medium">
                    {c.author_name}
                    <span className="text-xs text-gray-400 ml-2">
                        {new Date(c.created_at).toLocaleString()}
                    </span>
                </div>

                {/* 댓글 본문 */}
                {c.is_deleted === 1 ? (
                    <p className="text-sm text-gray-400">삭제된 댓글입니다.</p>
                ) : editId === c.id ? (
                    <>
                        <textarea className="w-full border rounded p-2 text-sm" value={editText} onChange={e => setEditText(e.target.value)} />
                        <div className="flex gap-2 mt-1">
                            <button onClick={() => update(c.id)} className="text-xs hover:text-blue-500">
                                저장
                            </button>
                            <button onClick={() => { setEditId(null); setEditText(""); }} className="text-xs text-gray-400">
                                취소
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-sm whitespace-pre-line">{c.content}</p>
                )}

                {/* 버튼 영역 */}
                {c.is_deleted === 0 && (
                    <div className="text-xs flex gap-3 mt-1 text-gray-500">
                        {(session?.user.id === c.author_id || session?.user.role === "admin") && (
                            <>
                                {session?.user.id === c.author_id && (
                                    <button onClick={() => { setEditId(c.id); setEditText(c.content); setReplyTo(null); }} className="hover:text-blue-500 cursor-pointer">
                                        수정
                                    </button>
                                )}
                                <button onClick={() => remove(c.id)} className="hover:text-red-500 cursor-pointer">
                                    삭제
                                </button>
                            </>
                        )}
                        <button onClick={() => { setReplyTo(c.id); setReplyText(""); setEditId(null); }} className="hover:text-blue-500 cursor-pointer">
                            답글
                        </button>
                    </div>
                )}

                {/* 답글 입력 */}
                {replyTo === c.id && (
                    <div className="mt-2">
                        <textarea className="w-full border rounded p-2 text-sm" value={replyText} onChange={e => setReplyText(e.target.value)} />
                        <button onClick={submit} className="text-xs mt-1 hover:text-blue-500 cursor-pointer">
                            답글 작성
                        </button>
                    </div>
                )}

                {render(c.id, depth + 1)}
            </div>
        ));

    return (
        <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-2">댓글</h4>

            {render(null)}

            {/* 최상위 댓글 */}
            <div className="mt-4">
                <textarea className="w-full border rounded p-2 text-sm" value={newText} onChange={e => setNewText(e.target.value)} placeholder="댓글을 입력하세요" />
                <button onClick={submit} className="mt-1 text-sm hover:text-blue-500 cursor-pointer">
                    댓글 작성
                </button>
            </div>
        </div>
    );
}
