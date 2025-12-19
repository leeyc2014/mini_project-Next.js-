'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"

export default function FindPassword() {
    const emailRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const checkEmail = async () => {
        const email = emailRef.current?.value;
        if (!email) {
            return alert("이메일을 입력하세요.")
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "존재하지 않는 이메일입니다.");
                emailRef.current!.value = "";
                return;
            }

            router.push(`resetpassword?email=${encodeURIComponent(email)}`);
        }
        catch {
            alert("이메일 확인 중 오류가 발생했습니다.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">이메일을 입력하세요.</h1>
                <input type="email" ref={emailRef} placeholder="이메일 입력" className="w-full border p-2 mb-4" />
                <button onClick={checkEmail} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer">확인</button>
            </div>
        </section>
    );
}
