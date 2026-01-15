'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BoardPost } from "@/types/board";
import { Comment } from "@/types/comment";
import BoardComment from "./boardcomment";

interface Props {
  postId: number | null;
}

export default function BoardDetail({ postId }: Props) {
  const { data: session } = useSession();
  const [detail, setDetail] = useState<BoardPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // 게시글 상세 + 댓글 fetch
  useEffect(() => {
    if (!postId) {
      setDetail(null);
      setComments([]);
      return;
    }

    const fetchDetail = async () => {
      try {
        const resPost = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${postId}`);
        const postData: BoardPost = await resPost.json();
        setDetail(postData);

        const resComment = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${postId}/comment`);
        const commentData: Comment[] = await resComment.json();
        setComments(commentData);
      } catch (err) {
        console.error("게시글 상세 불러오기 실패:", err);
        setDetail(null);
        setComments([]);
      }
    };

    fetchDetail();
  }, [postId]);

  // 댓글 등록
  const handleCommentSubmit = async (parentId?: number) => {
    if (!commentText.trim() || !postId) return;

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({
        content: commentText,
        parent_id: parentId || null,
      }),
    });

    setCommentText("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${postId}/comment`);
    setComments(await res.json());
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!postId) return;

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/comment/${commentId}`, {
      method: "DELETE",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${postId}/comment`);
    setComments(await res.json());
  };

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

      <BoardComment
        boardId={detail.id}
      />
    </div>
  );
}
