import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const [rows]: any = await pool.query(
      `
      SELECT id, title, content, author_id, author_name, created_at
      FROM board
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Board detail error:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { title, content } = await req.json();

  await pool.query(
    `
    UPDATE board
    SET title = ?, content = ?, updated_at = curdate()
    WHERE id = ? AND author_id = ?
    `,
    [title, content, id, session.user.id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await pool.query(
    `DELETE FROM board WHERE id = ? AND author_id = ?`,
    [id, session.user.id]
  );

  return NextResponse.json({ success: true });
}
