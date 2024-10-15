import { conectarBd } from "@/db/conectarDb";
import { Calculadora } from "@/utils/types";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export default async function CalculadoraPage({ params }: { params: { calculadora: string } }) {
    async function obtenerCalculadora() {        
        const conexion = await conectarBd();
        try {
            const [rows, fields] = await conexion.query('SELECT * FROM calculadora WHERE link = ?', [params.calculadora]);

            if (rows.length === 0) {
                redirect('/404');
            }
            
            return rows[0];
        } catch (error) {
            console.log(error);

            redirect('/404');
        }
    }

    const calculadora: Calculadora = await obtenerCalculadora();

    return (
        <div>
            <h1>Calculadora {calculadora.nombre}</h1>
        </div>
    )
}