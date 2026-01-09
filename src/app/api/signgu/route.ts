import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ctprvn_cd = searchParams.get("ctprvn_cd");

  if (!ctprvn_cd) {
    return NextResponse.json([], { status: 400 });
  }

  const [rows] = await pool.query(
    `
    SELECT signgu_cd, ctprvn_cd, signgu_nm
    FROM signgu_cd
    WHERE ctprvn_cd = ?
    ORDER BY signgu_nm
    `,
    [ctprvn_cd]
  );

  return NextResponse.json(rows);
}