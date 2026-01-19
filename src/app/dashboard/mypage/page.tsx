'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MyPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            setUsername(session.user.name);
        }
    }, [session?.user?.name]);

    if (status === "loading") return null;
    if (!session) return <p>로그인이 필요합니다.</p>;

    const handleUpdate = async () => {
        setLoading(true);

        const res = await fetch("/api/mypage", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        setLoading(false);

        if (res.ok) {
            await update({ name: username });

            toast.success("사용자 이름이 수정되었습니다.");
            router.push("/dashboard");
        } 
        else {
            toast.error("수정 실패");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-6">마이페이지</h2>
            <div className="mb-4">
                <label className="text-sm text-gray-500">아이디</label>
                <input type="text" value={session.user.id} readOnly className="w-full mt-1 bg-gray-100 border rounded px-3 py-2 text-sm" />
            </div>
            <div className="mb-6">
                <label className="text-sm text-gray-500">사용자 이름</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 border rounded px-3 py-2 text-sm" />
            </div>
            
            <button onClick={handleUpdate} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3">
                이름 수정
            </button>
        </div>
    );
}
