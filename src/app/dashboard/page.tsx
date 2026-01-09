'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("로그인이 필요합니다.");
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
    <div className="flex flex-col w-full h-full my-5 pr-5">
      <section className="flex flex-col items-end gap-4">
        <p className="text-end"><span className="font-bold text-2xl text-blue-900 pr-2">{session?.user?.id}</span>님</p>
        <div className="flex flex-row gap-3">
          {role === "admin" && (
            <Link href="/admin/membersdata" className="font-bold text-center">
              회원 관리
            </Link>
          )}
          {role === "member" && (
            <Link href="/dashboard/mypage" className="font-bold text-center">
              내 정보
            </Link>
          )}
          <Link href="/mapsearch" className="font-bold text-center">
            지도 검색
          </Link>
          <Link href="/listsearch" className="font-bold text-center">
            목록 검색
          </Link>
          <p onClick={handleLogout} className="font-bold rounded cursor-pointer text-center">로그아웃</p>
        </div>
      </section>
    </div>
  );
}
