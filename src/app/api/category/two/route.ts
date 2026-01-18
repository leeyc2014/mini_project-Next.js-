import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const sql = `
            SELECT ctgry_two_cd, ctgry_two_nm
            FROM ctgry_two_code
            ORDER BY ctgry_two_cd
        `;

        const [rows] = await pool.query(sql);
        return NextResponse.json(rows);
    }
    catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "대분류 조회 실패" }, { status: 500 }
        );
    }
}
