import Link from "next/link"

export default function TarjetaCalculadora(
    { titulo, descripcion_corta, enlace }:
        { titulo: string, descripcion_corta: string, enlace: string }
) {
    return (
        <Link href={enlace}>
            <div className="flex flex-row py-4 px-2 gap-2 rounded-lg border-orange-400">
                <h2>{titulo}</h2>
                <p>{descripcion_corta}</p>
            </div>
        </Link>
    )
}