import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                userid: { label: "아이디", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const { userid, password } = credentials;

                const [rows]: any = await pool.query(
                    'SELECT members.userid, members.role, member_passwords.password FROM members JOIN member_passwords ON members.userid = member_passwords.userid WHERE members.userid = ?',
                    [userid]
                );

                if (rows.length === 0) {
                    return null;
                }
                const isValid = await bcrypt.compare(password, rows[0].password);
                if (!isValid) {
                    return null;
                }

                return {
                    id: rows[0].userid,
                    role: rows[0].role,
                };
            },
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user.email) {
                    return false;
                }
                const useremail = user.email!;

                const [rows]: any = await pool.query(
                    "SELECT useremail FROM googlemembers WHERE useremail = ?",
                    [useremail]
                );

                if (rows.length === 0) {
                    await pool.query(
                        `INSERT INTO googlemembers (useremail) VALUES (?)`,
                        [useremail]
                    );
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (account?.provider === "credentials" && user) {
                token.id = user.id;               // credentials
                token.role = user.role;
            }
            if (account?.provider === "google") {
                token.id = user.email;            // google      
                token.role = "member";
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role;
            }
            return session;
        }

    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };