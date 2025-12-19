import { NextResponse } from "next/server";
import pool from '@/lib/db';
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM members');
        return NextResponse.json(rows);
    }
    catch(err) {
        return NextResponse.json({error: 'DB error'}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const { userid, username, password } = await request.json();

        if(!userid || !username || password) {
            return NextResponse.json({error: "필수 값 누락"}, {status: 400});
        }

        const [exist]: any = await pool.query(
            "SELECT id FROM members WHERE userid = ?", [userid]
        );

        if(exist.length > 0) {
            return NextResponse.json({error: "이미 존재하는 아이디입니다."}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 회원 정보 저장
        await pool.query(
            `INSERT INTO members (userid, username, provider) VALUES (?, ?, ?)`,
            [userid, username, "credentials"]
        );

        // 비밀번호까지 저장
        await pool.query(
            'INSERT INTO members_passwords (userid, password) VALUES (?, ?)',
            [userid, hashedPassword]
        );

        return NextResponse.json({ message: "회원가입 성공" });
    }
    catch(err) {
        return NextResponse.json({ error: "서버 오류" }, {status: 500});
    }
}