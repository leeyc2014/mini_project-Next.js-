'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full my-5 pr-5">
      <Link href="/dashboard/chart" className="font-bold text-center">
        차트
      </Link>
    </div>
  );
}
