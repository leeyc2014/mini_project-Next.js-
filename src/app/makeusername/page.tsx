'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CompleteProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const usernameRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    // 아직 세션 로딩 중
    if (status === "loading") return null;

    // 비로그인 접근 차단
    if (!session?.user?.email) {
        router.replace("/");
        return null;
    }

    const handleSubmit = async () => {
        const username = usernameRef.current?.value.trim();

        if (!username) {
            return toast.error("username을 입력하세요.");
        }

        if (username.length < 3) {
            return toast.error("username은 최소 3자 이상이어야 합니다.");
        }

        setLoading(true);

        try {
            const res = await fetch("/api/googlemembers/username", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    useremail: session.user.email,
                    username,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "username 설정 실패");
                return;
            }

            toast.success("username 설정 완료!");
            router.replace("/");
        } catch (err) {
            toast.error("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-2">추가 정보 입력</h1>
                <p className="text-sm text-gray-600 mb-4">
                    서비스에서 사용할 username을 설정해주세요.
                </p>
                <input ref={usernameRef} type="text" placeholder="username 입력" className="w-full border p-2 mb-4 rounded" disabled={loading} />
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium">
                    {loading ? "저장 중..." : "완료"}
                </button>
            </div>
        </section>
    );
}
