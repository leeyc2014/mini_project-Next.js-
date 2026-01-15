import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    const [rows] = await pool.query(
        `
        SELECT 
            id,
            title,
            author_name,
            created_at
        FROM board
        WHERE is_deleted = 0
        ORDER BY created_at DESC
        LIMIT 5
        `
    );

    return NextResponse.json(rows);
}
