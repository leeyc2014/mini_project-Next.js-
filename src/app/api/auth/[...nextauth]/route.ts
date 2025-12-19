import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({user, account}) {
            if(account?.provider === "google") {
                const userid = user.email!;
                const username = user.name ?? "";

                const [rows]: any = await pool.query(
                    "SELECT userid FROM members WHERE userid = ?",
                    [userid]
                );

                if(rows.length === 0) {
                    await pool.query(
                        `INSERT INTO members (userid, username, provider) VALUES (?, ?, ?)`,
                        [userid, username, "google"]
                    );
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if(user) {
                token.userid = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if(session.user) {
                session.user.id = token.userid as string;
            }
            return session;
        },
    },
});

export {handler as GET, handler as POST};