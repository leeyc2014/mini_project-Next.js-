import type { Metadata } from "next";
import Providers from "../providers";
import { Toaster } from "react-hot-toast";
import NavLink from "@/components/navlink";
import Username from "@/components/username";

export const metadata: Metadata = {
    title: "miniproject",
    description: "miniproject",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
                <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
                    <nav className="flex items-center gap-10">
                        <NavLink href="/dashboard">홈</NavLink>
                        <NavLink href="/dashboard/listsearch">목록 검색</NavLink>
                        <NavLink href="/dashboard/mapsearch">지도 검색</NavLink>
                        <NavLink href="/dashboard/board">게시판</NavLink>
                    </nav>
                    <Username />
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-6">
                {children}
            </main>
            <footer className="mt-16 border-t bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
                    <p> 전국 반려동물 동반 가능 시설 데이터를 기반으로 위치·조건별 검색과 시계열 분석을 제공하는 웹 페이지</p>
                    <p className="mt-1">지도 검색 · 필터 목록 검색 · 데이터 차트 시각화 · 자유 게시판 기능을 포함</p>
                </div>
            </footer>
        </>
    );
}
