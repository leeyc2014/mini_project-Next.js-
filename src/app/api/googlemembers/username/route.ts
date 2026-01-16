import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function PUT(request: Request) {
    const { useremail, username } = await request.json();

    if (!useremail || !username) {
        return NextResponse.json(
            { message: "필수 값 누락" },
            { status: 400 }
        );
    }

    // 중복 체크
    const [exist]: any = await pool.query(
        "SELECT id FROM googlemembers WHERE username = ?",
        [username]
    );

    if (exist.length > 0) {
        return NextResponse.json(
            { message: "이미 사용 중인 username입니다." },
            { status: 409 }
        );
    }

    await pool.query(
        "UPDATE googlemembers SET username = ? WHERE useremail = ?",
        [username, useremail]
    );

    return NextResponse.json({ message: "username 설정 완료" });
}
