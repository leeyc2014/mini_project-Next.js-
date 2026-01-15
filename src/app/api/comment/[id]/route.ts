import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const { id } = await context.params;
    const { content } = await req.json();

    const [result]: any = await pool.query(
        `
    UPDATE board_comment
    SET content = ?
    WHERE id = ? AND author_id = ?
    `,
        [content, id, session.user.id]
    );

    return NextResponse.json({ success: result.affectedRows > 0 });
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [[comment]]: any = await pool.query(
        `SELECT author_id FROM board_comment WHERE id = ?`,
        [id]
    );

    if (!comment) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = comment.author_id === session.user.id;

    // 수정은 허용 안 함, 삭제만
    if (!isAdmin && !isOwner) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // soft delete
    await pool.query(
        `
    UPDATE board_comment
    SET is_deleted = 1,
        deleted_at = NOW()
    WHERE id = ?
    `,
        [id]
    );

    return NextResponse.json({ success: true });
}



