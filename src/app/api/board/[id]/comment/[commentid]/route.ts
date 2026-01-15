import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await context.params;

  await pool.query(
    `
    UPDATE board_comment
    SET is_deleted = 1, deleted_at = NOW()
    WHERE id = ? AND author_id = ?
    `,
    [commentId, session.user.id]
  );

  return NextResponse.json({ success: true });
}
