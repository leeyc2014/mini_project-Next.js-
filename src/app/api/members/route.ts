import { NextResponse } from "next/server";
import pool from '@/lib/db';
import bcrypt from "bcryptjs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    
    if(!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401});
    }
    try {
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');
        const username = searchParams.get('username');
        const createdate = searchParams.get('createdate');

        let sql = 'SELECT * FROM members';
        const params: any[] = [];

        if (userid) {
            sql += ' WHERE userid LIKE ?';
            params.push(`%${userid}%`);
        }
        else if (username) {
            sql += ' WHERE username LIKE ?';
            params.push(`%${username}%`)
        }
        else if (createdate) {
            sql += ' WHERE DATE(createdate) = ?'
            params.push(createdate)
        }

        const [rows] = await pool.query(sql, params);

        return NextResponse.json(rows);
    }
    catch (error) {
        console.error("GET /api/members error: ", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userid, username, password } = await request.json();

        if (!userid || !username || !password) {
            return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
        }

        const [exist]: any = await pool.query(
            "SELECT userid FROM members WHERE userid = ?", [userid]
        );

        if (exist.length > 0) {
            return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 회원 정보 저장
        await pool.query(
            `INSERT INTO members (userid, username) VALUES (?, ?)`,
            [userid, username]
        );

        // 비밀번호까지 저장
        await pool.query(
            'INSERT INTO member_passwords (userid, password) VALUES (?, ?)',
            [userid, hashedPassword]
        );

        return NextResponse.json({ message: "회원가입 성공" });
    }
    catch (err) {
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}