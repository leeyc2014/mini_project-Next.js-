import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword");

        if (!keyword) {
            return NextResponse.json([]);
        }

        const [rows] = await pool.query(
            `
            SELECT id, fclty_nm, rdnmadr_nm, lnm_addr
            FROM place
            WHERE fclty_nm LIKE ?
            ORDER BY fclty_nm
            LIMIT 5
            `,
            [`%${keyword}%`]
        );

        return NextResponse.json(rows);
    }
    catch (error) {
        console.error("APi 오류: ", error);
        return NextResponse.json([], { status: 500 });
    }
}
