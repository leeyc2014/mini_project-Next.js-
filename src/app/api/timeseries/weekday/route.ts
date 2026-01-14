import { NextResponse } from "next/server";
import pool from "@/lib/db";


export async function GET() {
    const sql = `
        SELECT
            d.weekday,
            d.weekday_name,
            COUNT(DISTINCT o.place_id) AS open_cnt
        FROM weekday_dim d
        JOIN calendar_dim cal
            ON cal.cal_date = DATE_ADD(
                CURDATE(),
                INTERVAL (d.weekday - WEEKDAY(CURDATE())) DAY
            )
        JOIN operationdata o
            ON o.day_of_week = d.weekday
        JOIN holidaydata h
            ON h.place_id = o.place_id
        WHERE
            -- 요일 휴무
            CASE d.weekday
                WHEN 0 THEN h.closed_mon
                WHEN 1 THEN h.closed_tue
                WHEN 2 THEN h.closed_wed
                WHEN 3 THEN h.closed_thu
                WHEN 4 THEN h.closed_fri
                WHEN 5 THEN h.closed_sat
                WHEN 6 THEN h.closed_sun
            END = 0

            -- 주차 휴무
            AND CASE cal.week_of_month
                WHEN 1 THEN h.closed_week_1
                WHEN 2 THEN h.closed_week_2
                WHEN 3 THEN h.closed_week_3
                WHEN 4 THEN h.closed_week_4
                ELSE h.closed_week_5
            END = 0

            -- 월 휴무
            AND (
                h.closed_months IS NULL
                OR JSON_CONTAINS(h.closed_months, CAST(cal.month AS JSON)) = 0
            )

            -- 날짜 휴무
            AND (
                h.closed_dates IS NULL
                OR JSON_CONTAINS(h.closed_dates, CAST(cal.day AS JSON)) = 0
            )

            -- 공휴일 휴무
            AND (
                h.closed_holiday = 0
                OR cal.is_holiday = 0
            )

        GROUP BY d.weekday, d.weekday_name
        ORDER BY d.weekday;
    `;

  const [rows] = await pool.query(sql);
  return NextResponse.json(rows);
}
