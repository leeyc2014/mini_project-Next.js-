'use client'

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const checkPasswordRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const email = emailRef.current?.value;
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const checkPassword = checkPasswordRef.current?.value;

        if (!email || !username || !password || !checkPassword) {
            alert('모든 항목을 입력해주세요.');
            setLoading(false);
            return;
        }

        if (password !== checkPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${baseUrl}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                alert("회원가입 실패");
                setLoading(false);
                return;
            }
            alert("회원가입 성공");
            router.push("/");
        }
        catch (err) {
            alert('회원가입 중 오류가 발생했습니다.');
        }
        finally {
            setLoading(false);
        }
    };
    
    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">이메일</label>
                        <input type="email" id="email" ref={emailRef} className="w-full p-2 border rounded" placeholder="이메일 입력" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium">사용자 이름</label>
                        <input type="text" id="username" ref={usernameRef} className="w-full p-2 border rounded" placeholder="사용자 이름 입력" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium">비밀번호</label>
                        <input type="password" id="password" ref={passwordRef} className="w-full p-2 border rounded" placeholder="비밀번호 입력" />
                    </div>
                    <div>
                        <label htmlFor="checkPassword" className="block mb-2 text-sm font-medium">비밀번호 확인</label>
                        <input type="password" id="checkPassword" ref={checkPasswordRef} className="w-full p-2 border rounded" placeholder="비밀번호 확인" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer">
                        {loading ? "가입 중..." : "회원가입"}
                    </button>
                </form>
            </div>
        </section>
    )
}