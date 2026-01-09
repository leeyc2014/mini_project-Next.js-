import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("id");

    if (!placeId) {
        return NextResponse.json(
            { message: "id is required" },
            { status: 400 }
        );
    }

    const sql = `
        SELECT id, fclty_nm, rdnmadr_nm, lnm_addr, tel_no, hmpg_url, rstde_guid_cn, oper_time, parkng_posbl_at, utiliiza_prc_cn, pet_posbl_at, entrn_posbl_pet_size_value, pet_lmtt_mtr_cn, in_place_acp_posbl_at, out_place_acp_posbl_at, fclty_info_dc, pet_acp_adit_chrge_value
        FROM detaildata
        WHERE id = ?
    `;

    const [rows]: any = await pool.query(sql, [placeId]);

    if (rows.length === 0) {
        return NextResponse.json(
            { message: "Not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(rows[0]);
}
