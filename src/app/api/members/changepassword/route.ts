import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
    try {
        const { id, newPassword } = await request.json();

        if (!id || !newPassword) {
            return NextResponse.json(
                { message: "userid와 password는 필수입니다." }, { status: 400 }
            );
        }

        // 아이디 존재 확인
        const [users]: any = await pool.query(
            "SELECT userid FROM member_passwords WHERE userid = ?",
            [id]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { message: "존재하지 않는 사용자입니다." }, { status: 404 }
            );
        }

        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 비밀번호 업데이트
        await pool.query(
            "UPDATE member_passwords SET password = ? WHERE userid = ?",
            [hashedPassword, id]
        );

        return NextResponse.json({ message: "비밀번호가 변경되었습니다." });
    }
    catch (error) {
        console.error("PUT /api/members/changepassword error:", error);
        return NextResponse.json(
            { message: "서버 오류" }, { status: 500 }
        );
    }
}
