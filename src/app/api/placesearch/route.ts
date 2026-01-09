import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    /* ===== 검색 / 분류 ===== */
    const searchType = searchParams.get('searchType'); // FCLTY_NM | RDNMADR_NM | CTGRY_THREE_NM
    const keyword = searchParams.get('keyword');

    /* ===== 지역 ===== */
    const ctpCd = searchParams.get('ctpCd');
    const sigCd = searchParams.get('sigCd');
    const dongCd = searchParams.get('dongCd');

    /* ===== 카테고리 ===== */
    const twoCd = searchParams.get('twoCd');
    const threeCds = searchParams.getAll('threeCd'); // 다중 선택

    /* ===== 영업 / 휴무 ===== */
    const openNow = searchParams.get('openNow');
    const dayOfWeek = searchParams.get('dayOfWeek');
    const targetTimeParam = searchParams.get('targetTime');

    const holidayOpen = searchParams.get('holidayOpen');
    const seolOpen = searchParams.get('seolOpen');
    const chuseokOpen = searchParams.get('chuseokOpen');
    const christmasOpen = searchParams.get('christmasOpen');

    /* ===== 페이징 ===== */
    const page = Number(searchParams.get('page') || 1);
    const size = Number(searchParams.get('size') || 10);
    const offset = (page - 1) * size;

    /* ===== 현재 시간 ===== */
    const now = new Date();
    const nowDay = (now.getDay() + 6) % 7; // 일=0 → 월=0
    const nowTime = now.toTimeString().slice(0, 5);

    const targetDay =
        dayOfWeek !== null ? Number(dayOfWeek) : openNow ? nowDay : null;
    const targetTime =
        targetTimeParam ?? (openNow ? nowTime : null);

    /* ===== 반려동물 크기 ===== */
    const petSizesStr: string[] = searchParams.getAll('petSize');
    const petSizes: number[] = petSizesStr
        .flatMap(s => s.split(','))
        .map(Number)
        .filter(n => !isNaN(n));

    /* ===== 반려동물 전용 여부 ===== */
    const petOnlyStrs = searchParams.getAll('petOnly');
    const petOnlyValues: number[] = petOnlyStrs
        .flatMap(v => v.split(','))
        .map(Number)
        .filter(v => !isNaN(v));


    /* ===== WHERE 생성 ===== */
    let where = `WHERE 1=1`;
    const params: any[] = [];

    /* ===== 검색어 ===== */
    if (keyword && searchType) {
        if (searchType === 'FCLTY_NM') {
            where += ` AND p.fclty_nm LIKE ?`;
            params.push(`%${keyword}%`);
        } else if (searchType === 'RDNMADR_NM') {
            where += ` AND l.rdnmadr_nm LIKE ?`;
            params.push(`%${keyword}%`);
        } else if (searchType === 'CTGRY_THREE_NM') {
            where += ` AND c.ctgry_three_nm LIKE ?`;
            params.push(`%${keyword}%`);
        }
    }

    /* ===== 지역 ===== */
    if (ctpCd) {
        where += ` AND l.ctprvn_cd = ?`;
        params.push(ctpCd);
    }
    if (sigCd) {
        where += ` AND l.signgu_cd = ?`;
        params.push(sigCd);
    }
    if (dongCd) {
        where += ` AND l.dong_cd = ?`;
        params.push(dongCd);
    }

    /* ===== 카테고리 ===== */
    if (twoCd) {
        where += ` AND c.ctgry_two_cd = ?`;
        params.push(twoCd);
    }
    if (threeCds.length > 0) {
        where += ` AND c.ctgry_three_cd IN (${threeCds.map(() => '?').join(',')})`;
        params.push(...threeCds);
    }

    /* ===== 휴무일 ===== */
    if (targetDay !== null) {
        const col = [
            'closed_mon',
            'closed_tue',
            'closed_wed',
            'closed_thu',
            'closed_fri',
            'closed_sat',
            'closed_sun',
        ][targetDay];
        where += ` AND h.${col} = 0`;
    }

    if (holidayOpen) where += ` AND h.closed_holiday = 0`;
    if (seolOpen) where += ` AND h.closed_seol = 0`;
    if (chuseokOpen) where += ` AND h.closed_chuseok = 0`;
    if (christmasOpen) where += ` AND h.closed_christmas = 0`;

    /* ===== 영업시간 ===== */
    if (targetDay !== null && targetTime) {
        where += `
      AND EXISTS (
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
    `;
        params.push(targetDay, targetTime, targetTime, targetTime);
    }

    /* ===== 반려동물 크기 ===== */
    if (petSizes.length > 0) {
        where += ` AND s.pet_size IN (${petSizes.map(() => '?').join(',')})`;
        params.push(...petSizes);
    }

    /* ===== 반려동물 전용 여부 ===== */
    if (petOnlyValues.length > 0) {
        where += ` AND i.pet_info IN (${petOnlyValues.map(() => '?').join(',')})`;
        params.push(...petOnlyValues);
    }


    /* ===== SQL ===== */
    const sql = `
    SELECT DISTINCT
      p.id,
      p.fclty_nm,
      p.rdnmadr_nm,
      p.lnm_addr
    FROM place p
    JOIN holidaydata h ON p.id = h.place_id
    LEFT JOIN locationdata l ON p.id = l.id
    LEFT JOIN categorydata c ON p.id = c.id
    LEFT JOIN sizefilterdata s ON p.id = s.place_id
    LEFT JOIN infofilterdata i ON p.id = i.place_id
    ${where}
    LIMIT ? OFFSET ?
  `;

    params.push(size, offset);

    const [rows] = await pool.query(sql, params);

    return NextResponse.json({
        page,
        size,
        data: rows,
    });
}
