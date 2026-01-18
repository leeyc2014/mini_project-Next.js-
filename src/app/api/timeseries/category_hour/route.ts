import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    const sql = `
        SELECT hd.hour, ct.ctgry_two_nm AS category,
        COUNT(DISTINCT o.place_id) AS open_count
        FROM calendar_dim cal
        JOIN hour_dim hd
        JOIN operationdata o
        ON o.day_of_week = cal.weekday
        AND (
        (
            o.is_next_day = 0
            AND hd.hour >= HOUR(o.open_time)
            AND hd.hour < HOUR(o.close_time)
        )
        OR (
            o.is_next_day = 1
            AND (
            hd.hour >= HOUR(o.open_time)
            OR hd.hour < HOUR(o.close_time)
            )
        )
        )
        JOIN categorydata c
        ON c.id = o.place_id
        JOIN ctgry_two_code ct
        ON ct.ctgry_two_cd = c.ctgry_two_cd
        LEFT JOIN holidaydata h
        ON h.place_id = o.place_id
        WHERE cal.cal_date = CURDATE()
        AND NOT (
            (cal.weekday = 0 AND h.closed_mon = 1) OR
            (cal.weekday = 1 AND h.closed_tue = 1) OR
            (cal.weekday = 2 AND h.closed_wed = 1) OR
            (cal.weekday = 3 AND h.closed_thu = 1) OR
            (cal.weekday = 4 AND h.closed_fri = 1) OR
            (cal.weekday = 5 AND h.closed_sat = 1) OR
            (cal.weekday = 6 AND h.closed_sun = 1)
        )
        GROUP BY hd.hour, ct.ctgry_two_nm
        ORDER BY hd.hour, ct.ctgry_two_nm;
        `

    const [rows] = await pool.query(sql)

    const result: Record<number, any> = {}

    for (const r of rows as any[]) {
        if (!result[r.hour]) {
            result[r.hour] = { hour: r.hour }
        }
        result[r.hour][r.category] = r.open_count
    }

    return NextResponse.json(Object.values(result))
}
