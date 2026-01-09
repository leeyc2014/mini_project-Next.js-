import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const twoCd = searchParams.get("ctgry_two_cd");
    const threeCds = searchParams.getAll("ctgry_three_cd");

    let sql = `
    SELECT id, FCLTY_NM, LC_LA, LC_LO, CTGRY_TWO_CD, CTGRY_THREE_CD, LNM_ADDR, RDNMADR_NM
    FROM categorydata
    WHERE 1=1
  `;
    const params: any[] = [];

    if (twoCd) {
        sql += " AND CTGRY_TWO_CD = ?";
        params.push(twoCd);
    }
    if (threeCds.length > 0) {
        sql += ` AND CTGRY_THREE_CD IN (${threeCds.map(() => "?").join(",")})`;
        params.push(...threeCds);
    }

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
}