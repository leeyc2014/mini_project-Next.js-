'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import BoardList from "@/components/board/boardlist";
import BoardDetail from "@/components/board/boarddetail";
import BoardSearch from "@/components/board/boardsearch";

export default function BoardPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="flex flex-col gap-6">
                <BoardSearch />
                <BoardList pageSize={10} selectedId={selectedId} onSelect={setSelectedId} onCreate={() => router.push("/dashboard/board/new")} />
            </div>
            <div>
                <BoardDetail postId={selectedId} />
            </div>
        </div>
    );
}
