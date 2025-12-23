import { NextResponse } from "next/server";
import pool from '@/lib/db';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized'}, { status: 401});
    }
    try {
        const { searchParams } = new URL(request.url);
        const useremail = searchParams.get('useremail');
        const createdate = searchParams.get('createdate');

        let sql = 'SELECT * FROM googlemembers';
        const params: any[] = [];

        if (useremail) {
            sql += ' WHERE userid LIKE ?';
            params.push(`%${useremail}%`);
        }
        else if (createdate) {
            sql += ' WHERE DATE(createdate) = ?'
            params.push(createdate)
        }

        const [rows] = await pool.query(sql, params);

        return NextResponse.json(rows);
    }
    catch (error) {
        console.error("GET /api/googlemembers error: ", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}