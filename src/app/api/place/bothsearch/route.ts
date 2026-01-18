import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    /* 지역 */
    const ctprvnCd = searchParams.get("ctprvn_cd");
    const signguCd = searchParams.get("signgu_cd");
    const legaldongCd = searchParams.get("legaldong_cd");

    /* 카테고리 */
    const twoCd = searchParams.get("ctgry_two_cd");
    const threeCds = searchParams.getAll("ctgry_three_cd");

    let sql = 
        `
        SELECT DISTINCT l.id, l.FCLTY_NM, l.LC_LA, l.LC_LO, l.LNM_ADDR, l.RDNMADR_NM, l.CTPRVN_CD, l.SIGNGU_CD, l.LEGALDONG_CD, c.CTGRY_TWO_CD, c.CTGRY_THREE_CD
        FROM locationdata l
        INNER JOIN categorydata c
        ON l.FCLTY_NM = c.FCLTY_NM
        WHERE 1=1
        `
    ;

    const params: any[] = [];

    /* 지역 조건 (있으면 무조건 AND) */
    if (ctprvnCd) {
        sql += " AND l.CTPRVN_CD = ?";
        params.push(ctprvnCd);
    }
    if (signguCd) {
        sql += " AND l.SIGNGU_CD = ?";
        params.push(signguCd);
    }
    if (legaldongCd) {
        sql += " AND l.LEGALDONG_CD = ?";
        params.push(legaldongCd);
    }

    /* 카테고리 조건 */
    if (twoCd) {
        sql += " AND c.CTGRY_TWO_CD = ?";
        params.push(twoCd);
    }

    if (threeCds.length > 0) {
        sql += ` AND c.CTGRY_THREE_CD IN (${threeCds.map(() => "?").join(",")})`;
        params.push(...threeCds);
    }

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
}
