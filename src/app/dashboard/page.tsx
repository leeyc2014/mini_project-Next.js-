'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function page() {

  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("로그인이 필요합니다.")
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-20 text-4xl font-bold">로딩 중 ...</p>;
  }

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="m-5">
      <section className="flex flex-col items-end gap-4">
        <p className="text-end"><span className="font-bold text-2xl text-blue-900 pr-2">{session?.user?.id}</span>님</p>
        <div className="flex flex-row gap-3">
          {role === "admin" && (
            <Link href="/admin/membersdata" className="font-bold text-center">회원 관리</Link>
          )}
          <Link href="/dashboard/mypage" className="font-bold text-center">내 정보</Link>
          <p onClick={handleLogout} className="font-bold rounded cursor-pointer text-center">로그아웃</p>
        </div>
      </section>
    </div>
  )
}
