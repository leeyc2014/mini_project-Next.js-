'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"

export default function FindPassword() {
    const idRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkid = async () => {
        const id = idRef.current?.value;
        if (!id) {
            return alert("아이디를 입력하세요.")
        }
        setLoading(true);
        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "존재하지 않는 아이디입니다.");
                idRef.current!.value = "";
                return;
            }

            router.push(`resetpassword?id=${encodeURIComponent(id)}`);
        }
        catch {
            alert("아이디 확인 중 오류가 발생했습니다.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">아이디를 입력하세요.</h1>
                <input type="id" ref={idRef} placeholder="아이디 입력" className="w-full border p-2 mb-4" />
                <button onClick={checkid} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer">확인</button>
            </div>
        </section>
    );
}
