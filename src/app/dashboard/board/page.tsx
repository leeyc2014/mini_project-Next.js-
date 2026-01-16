'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import BoardList from "@/components/board/boardlist";
import BoardDetail from "@/components/board/boarddetail";
import BoardSearch from "@/components/board/boardsearch";

export default function BoardPage() {
  // 선택된 게시글 ID
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <BoardSearch />
      {/* 게시글 리스트 + Pagination */}
      <BoardList pageSize={10} selectedId={selectedId} onSelect={setSelectedId} onCreate={() => router.push("/board/new")}/>

      {/* 선택된 게시글 상세 */}
      <BoardDetail postId={selectedId} />
    </div>
  );
}
