import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    const sql = 
        `
        WITH place_summary AS (
        SELECT
            place_id,
            COUNT(DISTINCT day_of_week) AS day_cnt,
            MIN(open_time) AS min_open,
            MAX(close_time) AS max_close,
            MAX(is_next_day) AS has_next_day
        FROM operationdata
        GROUP BY place_id
        )

        SELECT
        CASE
            WHEN day_cnt = 7
            AND min_open = '00:00:00'
            AND max_close IN ('23:50:00','23:59:00','24:00:00')
            AND has_next_day = 0
            THEN '24시간 운영'
            ELSE '일반 운영'
        END AS type,
        COUNT(*) AS cnt
        FROM place_summary
        GROUP BY type;
    `;

    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
}
