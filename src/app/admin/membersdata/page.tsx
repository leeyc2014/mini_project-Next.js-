'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import MembersData from "@/app/membersdatacomponent/members";
import GoogleMembersData from "@/app/membersdatacomponent/googlemembers";

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === "loading") {
            return;
        }
        if(status === "unauthenticated") {
            toast.error("로그인이 필요합니다.");
            router.replace("/");
            return;
        }
        
        if(session?.user?.role !== "admin") {
            toast.error("권한이 없습니다.");
            router.replace("/dashboard");
        }
    }, [status, session, router]);

    if(status === "loading") {
        return <p className="text-center mt-20 text-4xl font-bold">로딩 중...</p>
    }

    if(session?.user?.role !== "admin") {
        return null;
    }

    return (
        <>
            <MembersData />
            <GoogleMembersData />
        </>
    );
}