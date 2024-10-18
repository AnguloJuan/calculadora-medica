import { conectarBd } from "@/db/conectarDb";
import { Unidad } from "@/utils/types";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const conexion = await conectarBd();
    try {
        const [unidades] = await conexion.query<RowDataPacket[]>(
            'SELECT * FROM `unidades` ORDER BY `name` ASC;'
        );

        if (unidades.length === 0) {
            NextResponse.json([], { status: 500 });
        }

        NextResponse.json({ unidades }, { status: 200 });
    } catch (error) {
        console.log(error);
        NextResponse.json([], { status: 500 });
    }
}