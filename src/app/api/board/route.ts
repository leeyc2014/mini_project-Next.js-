import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        /* ===== 검색 ===== */
        const searchType = searchParams.get("searchType"); // title | content | author
        const keyword = searchParams.get("keyword");

        /* ===== 페이징 ===== */
        const page = Number(searchParams.get("page") || 1);
        const limit = 10;
        const offset = (page - 1) * limit;

        /* ===== WHERE 생성 ===== */
        let where = "WHERE 1=1"; // 기본
        const values: any[] = [];

        if (keyword && searchType) {
            if (searchType === "title") {
                where += " AND title LIKE ?";
            } else if (searchType === "content") {
                where += " AND content LIKE ?";
            } else if (searchType === "author") {
                where += " AND author_name LIKE ?";
            }
            values.push(`%${keyword}%`);
        }

        /* ===== 게시글 가져오기 ===== */
        const [rows] = await pool.query(
            `
            SELECT id, title, author_name, created_at
            FROM board
            ${where}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            `,
            [...values, limit, offset]
        );

        /* ===== totalCount 계산 ===== */
        const [countRows]: any = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM board
            ${where}
            `,
            values
        );

        return NextResponse.json({
            items: rows,
            total: countRows[0]?.total ?? 0,
        });
    } catch (error) {
        console.error("Board list error:", error);
        return NextResponse.json({ items: [], total: 0 }, { status: 500 });
    }
}
