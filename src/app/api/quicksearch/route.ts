import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json([]); // 🔥 반드시 배열
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

    return NextResponse.json(rows); // 🔥 반드시 return
  } catch (error) {
    console.error("QuickSearch API error:", error);

    // 🔥 에러 상황에서도 JSON 반환
    return NextResponse.json([], { status: 500 });
  }
}
