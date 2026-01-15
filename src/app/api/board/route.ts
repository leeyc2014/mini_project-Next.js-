import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const searchType = searchParams.get("searchType"); // title | content | author
        const keyword = searchParams.get("keyword");
        const page = Number(searchParams.get("page") || 1);
        const limit = 10;
        const offset = (page - 1) * limit;

        let where = "";
        const values: any[] = [];

        if (keyword && searchType) {
            if (searchType === "title") {
                where = "WHERE title LIKE ?";
            } else if (searchType === "content") {
                where = "WHERE content LIKE ?";
            } else if (searchType === "author") {
                where = "WHERE author_name LIKE ?";
            }
            values.push(`%${keyword}%`);
        }

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

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Board list error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
