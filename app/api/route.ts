import { conectarBd } from "@/db/conectarDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const connection = await conectarBd();
    try {
        const [results] = await connection.query(
            'SELECT * FROM `parametro`',
            [10, 10]
        );

        console.log(results);
    } catch (err) {
        console.log(err);
    }
    return NextResponse.json({});
}