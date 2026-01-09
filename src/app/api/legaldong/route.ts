import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const signgu_cd = searchParams.get("signgu_cd");

  if (!signgu_cd) {
    return NextResponse.json([], { status: 400 });
  }

  const [rows] = await pool.query(
    `
    SELECT legaldong_cd, signgu_cd, legaldong_nm
    FROM legaldong_cd
    WHERE signgu_cd = ?
    ORDER BY legaldong_nm
    `,
    [signgu_cd]
  );

  return NextResponse.json(rows);
}