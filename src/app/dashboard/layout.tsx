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
            {/* ===== Header ===== */}
            <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
                <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">

                    {/* Navigation */}
                    <nav className="flex items-center gap-10">
                        <NavLink href="/dashboard">홈</NavLink>
                        <NavLink href="/dashboard/listsearch">목록 검색</NavLink>
                        <NavLink href="/dashboard/mapsearch">지도 검색</NavLink>
                        <NavLink href="/dashboard/board">게시판</NavLink>
                    </nav>

                    {/* User */}
                    <Username />
                </div>
            </header>

            {/* ===== Content ===== */}
            <main className="mx-auto max-w-7xl px-6 py-6">
                {children}
            </main>
        </>
    );
}
