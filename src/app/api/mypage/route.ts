import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json(
            { message: "Unauthorized" }, { status: 401 }
        );
    }

    const { username } = await req.json();

    if (!username) {
        return NextResponse.json(
            { message: "사용자 이름이 없습니다." }, { status: 400 }
        );
    }

    await pool.query(
        `UPDATE members SET username = ? WHERE userid = ?`,
        [username, session.user.id]
    );

    return NextResponse.json({ success: true });
}
