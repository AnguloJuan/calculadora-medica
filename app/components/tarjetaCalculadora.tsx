import { Calculadora } from "@/utils/types"
import Link from "next/link"

export default function TarjetaCalculadora(
    calculadora: Calculadora
) {
    return (
        <Link href={`${calculadora.categoria}/${calculadora.enlace}`}>
            <div className="mx-auto max-w-md rounded-lg bg-white shadow transition">
                <div className="p-4">
                    <h3 className="text-xl font-medium text-gray-900">
                        {calculadora.nombre}
                    </h3>
                    <p className="mt-1 text-gray-500">
                        {calculadora.descripcion_corta}
                    </p>
                </div>
            </div>
        </Link>
    )
}