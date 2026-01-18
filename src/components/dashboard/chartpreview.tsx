import Link from "next/link";
import { ReactNode } from "react";

export default function ChartPreview({
    title,
    href,
    children,
}: {
    title: string;
    href: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-xl bg-white border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{title}</h3>
                <Link href={href} className="text-sm text-blue-600 hover:underline">
                    자세히 보기 →
                </Link>
            </div>
            <div className="h-70">
                {children}
            </div>
        </div>
    );
}
