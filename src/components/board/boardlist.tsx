import { BoardPost } from "@/types/board";

export default function BoardList({
    posts,
    selectedId,
    onSelect,
}: {
    posts: BoardPost[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="rounded-xl bg-white border shadow-sm overflow-hidden">
            <ul className="divide-y">
                {posts.map(post => (
                    <li key={post.id} onClick={() => onSelect(post.id)} className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${selectedId === post.id ? "bg-blue-50" : ""}`}>
                        <p className="font-medium text-gray-900">
                            {post.title}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{post.author_name}</span>
                            <span>{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 페이징 자리 */}
            <div className="p-3 text-center text-sm text-gray-400">
                1 / 5
            </div>
        </div>
    );
}
