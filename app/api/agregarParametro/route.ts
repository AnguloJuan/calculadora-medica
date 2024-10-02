import { connect } from "@/utils/db";
import { Parametro } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
    // info received from formulario de agregar parametro
    const parametro: Parametro = req.body;
    const connection = await connect();
    try {
        await connection.query(
            'INSERT INTO `parametro` (`nombre`, `abreviatura`, `tipo`, `unidad`, `valorMinimo`, `valorMaximo`, `opciones`) VALUES (?, ?, ?, ?, ? , ?, ?)',
            [parametro.nombre, parametro.abreviatura, parametro.tipo, parametro.unidad, parametro.valorMinimo, parametro.valorMaximo, parametro.opciones]
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
    return NextResponse.json({ message: 'Parametro guardado con exito' },{status: 200});
}