import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

export async function GET() {
  const now = new Date();
  const nowDay = (now.getDay() + 6) % 7; // 일=0 → 월=0
  const nowTime = now.toTimeString().slice(0, 5);

  const sql = `
    WITH
    total_cnt AS (
      SELECT COUNT(*) cnt FROM place
    ),
    open_now AS (
      SELECT COUNT(DISTINCT p.id) cnt
      FROM place p
      WHERE EXISTS (
        SELECT 1
        FROM operationdata o
        WHERE o.place_id = p.id
          AND o.day_of_week = ?
          AND (
            (o.is_next_day = 0 AND ? BETWEEN o.open_time AND o.close_time)
            OR
            (o.is_next_day = 1 AND (? >= o.open_time OR ? <= o.close_time))
          )
      )
    ),
    open_24 AS (
      SELECT COUNT(*) cnt
      FROM (
        SELECT place_id
        FROM operationdata
        GROUP BY place_id
        HAVING
          COUNT(DISTINCT day_of_week) = 7
          AND MIN(open_time) = '00:00:00'
          AND MAX(close_time) IN ('23:50:00','23:59:00','24:00:00')
          AND MAX(is_next_day) = 0
      ) t
    )
    SELECT
      (SELECT cnt FROM total_cnt) AS total,
      (SELECT cnt FROM open_now) AS open_now,
      (SELECT cnt FROM open_24) AS open_24;
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [nowDay, nowTime, nowTime, nowTime]);
  return NextResponse.json(rows[0]);
}
