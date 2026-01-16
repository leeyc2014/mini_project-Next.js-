import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [rows] = await pool.query(
    `
    SELECT
      id,
      board_id,
      parent_id,
      content,
      author_id,
      author_name,
      is_deleted,
      created_at,
      updated_at
    FROM board_comment
    WHERE board_id = ?
    ORDER BY created_at ASC

    `,
    [id]
  );

  return NextResponse.json(rows);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params;
  const { content, parent_id } = await req.json();

  await pool.query(
    `
        INSERT INTO board_comment
            (board_id, parent_id, content, author_id, author_name)
        VALUES (?, ?, ?, ?, ?)
        `,
    [
      id,
      parent_id || null,
      content,
      session.user.id,
      session.user.name,
    ]
  );


  return NextResponse.json({ success: true });
}