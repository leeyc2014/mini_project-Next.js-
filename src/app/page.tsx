'use client'

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [rememberId, setRememberId] = useState(false);

  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const savedid = localStorage.getItem("savedid");

    if (savedid && idRef.current) {
      idRef.current.value = savedid;
      setRememberId(true);
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const userid = idRef.current?.value;
    const password = passwordRef.current?.value;

    if (!userid || !password) {
      toast.error("아이디과 비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        userid,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        toast.error("로그인 실패");
        return;
      }

      if (rememberId) {
        localStorage.setItem("savedid", userid);
      }
      else {
        localStorage.removeItem("savedid");
      }

      router.push("/dashboard");
    }
    catch (err) {
      toast.error("로그인 중 오류 발생");
    }
    finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", {
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  if(status === "loading") {
    return <p className="text-center mt-20 text-4xl font-bold">Loading...</p>
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl">로그인</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">아이디</label>
                <input type="text" name="userid" id="userid" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-black block w-full p-2.5" placeholder="아이디 입력" ref={idRef} />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호</label>
                <input type="password" name="password" id="password" placeholder="비밀번호 입력" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-black block w-full p-2.5" ref={passwordRef} />
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
                <Link href="/signup" className="font-medium cursor-pointer hover:underline">회원가입</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
