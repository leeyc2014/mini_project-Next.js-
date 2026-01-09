import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const twoCd = searchParams.get("ctgry_two_cd");

    if (!twoCd) {
      return NextResponse.json([], { status: 200 });
    }

    const sql = `
      SELECT
        ctgry_three_cd,
        ctgry_two_cd,
        ctgry_three_nm
      FROM ctgry_three_code
      WHERE ctgry_two_cd = ?
      ORDER BY ctgry_three_cd
    `;

    const [rows] = await pool.query(sql, [twoCd]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "중분류 조회 실패" },
      { status: 500 }
    );
  }
}
