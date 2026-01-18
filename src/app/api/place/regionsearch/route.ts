import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const ctprvnCd = searchParams.get("ctprvn_cd");
    const signguCd = searchParams.get("signgu_cd");
    const legaldongCd = searchParams.get("legaldong_cd");

    let sql = 
    `
        SELECT id, FCLTY_NM, LC_LA, LC_LO, CTPRVN_CD, SIGNGU_CD, LEGALDONG_CD, LNM_ADDR, RDNMADR_NM
        FROM locationdata
        WHERE 1=1
    `
    ;

    const params: any[] = [];

    if (ctprvnCd) {
        sql += " AND ctprvn_cd = ?";
        params.push(ctprvnCd);
    }
    if (signguCd) {
        sql += " AND signgu_cd = ?";
        params.push(signguCd);
    }
    if (legaldongCd) {
        sql += " AND legaldong_cd = ?";
        params.push(legaldongCd);
    }

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
}