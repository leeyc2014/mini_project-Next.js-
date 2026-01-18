import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() { 
    const sql = 
        `
        WITH today_info AS (
            SELECT
                WEEKDAY(CURDATE()) AS weekday,
                week_of_month,
                is_holiday
            FROM calendar_dim
            WHERE cal_date = CURDATE()
        )
        SELECT
            hd.hour,
            COUNT(DISTINCT o.place_id) AS open_cnt
        FROM hour_dim hd
        CROSS JOIN today_info t
        JOIN operationdata o
            ON o.day_of_week = t.weekday
        JOIN holidaydata h
            ON h.place_id = o.place_id
        WHERE
            (
                (o.is_next_day = 0
                 AND o.open_time <= MAKETIME(hd.hour,0,0)
                 AND o.close_time > MAKETIME(hd.hour,0,0))
                OR
                (o.is_next_day = 1
                 AND (o.open_time <= MAKETIME(hd.hour,0,0)
                      OR o.close_time > MAKETIME(hd.hour,0,0)))
            )

            -- 요일 휴무
            AND CASE t.weekday
                WHEN 0 THEN h.closed_mon
                WHEN 1 THEN h.closed_tue
                WHEN 2 THEN h.closed_wed
                WHEN 3 THEN h.closed_thu
                WHEN 4 THEN h.closed_fri
                WHEN 5 THEN h.closed_sat
                WHEN 6 THEN h.closed_sun
            END = 0

            -- 주차 휴무
            AND CASE t.week_of_month
                WHEN 1 THEN h.closed_week_1
                WHEN 2 THEN h.closed_week_2
                WHEN 3 THEN h.closed_week_3
                WHEN 4 THEN h.closed_week_4
                ELSE h.closed_week_5
            END = 0

            -- 공휴일
            AND (h.closed_holiday = 0 OR t.is_holiday = 0)

        GROUP BY hd.hour
        ORDER BY hd.hour;
        `;

    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
}
