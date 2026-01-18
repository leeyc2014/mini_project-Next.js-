'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={clsx("relative text-lg font-semibold transition-colors", "text-gray-600 hover:text-blue-600", isActive && "text-blue-600")}>
            {children}
            <span className={clsx("absolute -bottom-2 left-0 h-0.5 w-full bg-blue-600 transition-transform", isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
        </Link>
    );
}
