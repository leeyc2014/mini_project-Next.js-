'use client';

import { useState } from "react";
import BoardList from "@/components/board/boardlist";
import BoardDetail from "@/components/board/boarddetail";
import { BoardPost } from "@/types/board";

export default function BoardPage() {
  // 선택된 게시글 ID
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* 게시글 리스트 + Pagination */}
      <BoardList
        pageSize={10}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* 선택된 게시글 상세 */}
      <BoardDetail postId={selectedId} />
    </div>
  );
}
