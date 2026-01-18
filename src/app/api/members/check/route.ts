import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(request: Request) { 
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    if (!userid) {
        return NextResponse.json({ message: "존재하지 않는 아이디" }, { status: 400 });
    }

    const [rows]: any = await pool.query(
        "SELECT userid FROM members WHERE userid = ?",
        [userid]
    );

    return NextResponse.json({ exists: rows.length > 0 });
}
