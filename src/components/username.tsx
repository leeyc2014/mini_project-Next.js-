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
    <div className="flex items-center gap-4">
      {/* Username */}
      <div className="text-right">
        <p className="font-bold text-lg text-blue-900">{session?.user?.id} <span className="text-black">님</span></p>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-300" />

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm font-semibold">
        {role === "admin" && (
          <Link href="/dashboard/admin/membersdata" className="hover:text-blue-600">
            회원 관리
          </Link>
        )}

        {role === "member" && (
          <Link href="/dashboard/mypage" className="hover:text-blue-600">
            내 정보
          </Link>
        )}

        <button onClick={handleLogout} className="hover:text-red-500 transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  );
}
