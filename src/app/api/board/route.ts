import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const searchType = searchParams.get("searchType"); // title | content | author
        const keyword = searchParams.get("keyword");


        const page = Number(searchParams.get("page") || 1);
        const limit = 10;
        const offset = (page - 1) * limit;

        let where = "WHERE 1=1";
        const values: any[] = [];

        if (keyword && searchType) {
            if (searchType === "title") {
                where += " AND title LIKE ?";
            } 
            else if (searchType === "content") {
                where += " AND content LIKE ?";
            } 
            else if (searchType === "author") {
                where += " AND author_name LIKE ?";
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
    }
    catch (error) {
        console.error("게시글 목록 오류: ", error);
        return NextResponse.json({ items: [], total: 0 }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // 로그인 체크
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content } = await req.json();

        if (!title?.trim() || !content?.trim()) {
            return NextResponse.json({ message: "제목과 내용이 없습니다." }, { status: 400 });
        }

        const [result]: any = await pool.query(
            `
            INSERT INTO board (title, content, author_id, author_name, created_at)
            VALUES (?, ?, ?, ?, NOW())
            `,
            [title, content, session.user.id, session.user.name]
        );

        const insertedId = result.insertId;

        return NextResponse.json({ success: true, id: insertedId });
    } 
    catch (err) {
        console.error("게시글 등록 오류: ", err);
        return NextResponse.json({ message: "DB 오류" }, { status: 500 });
    }
}