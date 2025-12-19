'use client';

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
    const params = useSearchParams();
    const email = params.get("email");

    const passwordRef = useRef<HTMLInputElement>(null);
    const checkPasswordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleReset = async () => {
        const newPassword = passwordRef.current?.value;
        const checkPassword = checkPasswordRef.current?.value;
        if(!email || !newPassword) {
            return alert("비밀번호를 입력하세요.");
        }
        if(newPassword !== checkPassword) {
            return alert("비밀번호가 일치하지 않습니다.");
        }
        setLoading(true);

        try {
            const res = await fetch(`${baseUrl}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, newPassword}),
            });

            if(!res.ok) {
                const data = await res.json();
                alert(data.message || "비밀번호 변경 실패");
                return;
            }

            alert("비밀번호가 성공적으로 변경되었습니다.");
            router.push("/petcare");
        }
        catch {
            alert("비밀번호 변경 중 오류가 발생했습니다.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <p className="text-xl font-bold mb-4"><span className="mb-2 text-gray-700 font-medium">{email}</span>비밀번호 재설정</p>
                <input type="password" ref={passwordRef} placeholder="새 비밀번호 입력" className="w-full border p-2 mb-4"/>
                <input type="password" ref={checkPasswordRef} placeholder="비밀번호 확인" className="w-full border p-2 mb-4"/>
                <button onClick={handleReset} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer">비밀번호 변경</button>
            </div>
        </section>
    )
}