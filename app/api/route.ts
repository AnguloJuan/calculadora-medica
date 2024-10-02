import { NextRequest, NextResponse } from "next/server";
import { conectarBd } from "@/utils/db";

export async function GET(req: NextRequest) {
    const connection = await conectarBd();
    try {
        const [results] = await connection.query(
            'SELECT * FROM `parametro` WHERE `tipo` = ?',
            [10, 10]
        );

        console.log(results);
    } catch (err) {
        console.log(err);
    }
    return NextResponse.json({});
}