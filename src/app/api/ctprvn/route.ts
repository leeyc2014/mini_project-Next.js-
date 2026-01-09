import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT ctprvn_cd, ctprvn_nm
    FROM ctprvn_cd
    ORDER BY ctprvn_cd
  `);

  return NextResponse.json(rows);
}