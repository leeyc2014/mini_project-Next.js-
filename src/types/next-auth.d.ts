import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "admin" | "member";
            provider?: "credentials" | "google";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "admin" | "member";
        provider?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userid: string;
        role: "admin" | "member";
        provider?: "credentials" | "google";
    }
}
