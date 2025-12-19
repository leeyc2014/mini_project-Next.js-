'use client'

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { userAtom } from "@/atoms/atoms";
import { useAtom } from "jotai";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [rememberId, setRememberId] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail && emailRef.current) {
      emailRef.current.value = savedEmail;
      setRememberId(true);
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
      );

      if (!res.ok) {
        alert("로그인 실패");
        return;
      }

      const userData = await res.json();
      setUser(userData);

      if (rememberId) {
        localStorage.setItem("savedEmail", email);
      }
      else {
        localStorage.removeItem("savedEmail");
      }

      router.push("/dashboard");
    }
    catch (err) {
      alert("로그인 중 오류 발생");
    }
    finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };


  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl">로그인</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">이메일 주소</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="이메일 입력" ref={emailRef} />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호</label>
                <input type="password" name="password" id="password" placeholder="비밀번호 입력" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" ref={passwordRef} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)} className="w-4 h-4 border border-gray-300 rounded bg-gray-50" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">아이디 저장</label>
                  </div>
                </div>
                <Link href="/findpassword" className="text-sm font-medium text-primary-600 hover:underline cursor-pointer">비밀번호 찾기</Link>
              </div>
              <button type="submit" className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-blue-700 bg-blue-600 cursor-pointer">로그인</button>
              <div className="flex items-center">
                <div className="grow border-t border-gray-300" />
                <span className="mx-2 text-gray-400 text-sm">또는</span>
                <div className="grow border-t border-gray-300" />
              </div>
              <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-100 cursor-pointer">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />Google 로그인
              </button>
              <div className="flex justify-end text-sm font-light text-gray-500">
                <Link href="/signup" className="font-medium cursor-pointer">회원가입</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
