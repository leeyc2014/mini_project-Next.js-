'use client';

import { useState, useEffect } from "react";
import BoardSearch from "@/components/board/boardsearch";
import BoardList from "@/components/board/boardlist";
import BoardDetail from "@/components/board/boarddetail";
import { BoardPost } from "@/types/board";

export default function BoardPage() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPost = posts.find(p => p.id === selectedId) || null;

  useEffect(() => {
    const openPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board?page=1`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);
        }
        else {
          setPosts([]);
        }
      }
      catch (error) {
        console.error("게시글 불러오기 실패:", error);
        setPosts([]);
      }
      finally {
        setLoading(false);
      }
    };
    
    openPage();
  }, []);

  return (
    <div className="space-y-4">
      {/* 검색 + 글쓰기 */}
      <BoardSearch onResult={setPosts} />

      {/* 본문 영역 */}
      {loading ? (
        <div className="text-center text-gray-500">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BoardList posts={posts} selectedId={selectedId} onSelect={setSelectedId} />
          <BoardDetail post={selectedPost} />
        </div>
      )}
    </div>
  );
}
