import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM members');
        return NextResponse.json(rows);
    }
    catch(err) {
        return NextResponse.json({error: 'DB error'}, {status: 500});
    }
}