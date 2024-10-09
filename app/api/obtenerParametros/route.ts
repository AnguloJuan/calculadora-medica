import { conectarBd } from "@/db/conectarDb";
import { Parametro } from "@/utils/types";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    interface Parametros extends RowDataPacket, Parametro { }

    const conexion = await conectarBd();
    try {
        const [parametros] = await conexion.query<Parametros[]>(
            'SELECT * FROM `parametro` ORDER BY `nombre` ASC;'
        );
        return NextResponse.json(parametros, { status: 200 });
    } catch (err) {
        console.log(err);
    }
    return NextResponse.json({});
}