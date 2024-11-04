import { Calculadora } from "@/utils/types"
import Link from "next/link"

export default function TarjetaCalculadora(
    calculadora: Calculadora
) {
    return (
        <div className="max-w-md w-full rounded-lg bg-white shadow transition">
            <Link href={`${calculadora.categoria}/${calculadora.enlace}`}>
                <div className="max-w-md rounded-lg p-4">
                    <h3 className="text-xl font-medium text-gray-900">
                        {calculadora.nombre}
                    </h3>
                    <p className="mt-1 text-gray-500">
                        {calculadora.descripcion_corta}
                    </p>
                </div>
            </Link>
        </div>
    )
}