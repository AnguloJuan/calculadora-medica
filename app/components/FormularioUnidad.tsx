'use client'

import { Unidad } from "@/utils/types";
import { Boton } from "./Botones";
import { useEffect, useState } from "react";

interface FormularioUnidadProps {
    unidad: Unidad;
    setUnidad: (unidad: Unidad) => void;
}

export default function FormularioUnidad({ unidad, setUnidad }: FormularioUnidadProps) {
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    useEffect(() => {
        fetch('/api/unidades')
            .then(response => response.json())
            .then(data => setUnidades(data))
            .catch(error => console.error(error));
    }, [])

    return (<>
        <div className="w-full flex flex-col gap-2">
            <label htmlFor="unidad">Unidad</label>
            <input
                type="text"
                id="unidad"
                name="unidad"
                placeholder="Ingrese una unidad"
                value={unidad.unidad}
                onChange={(e) => setUnidad({ ...unidad, unidad: e.currentTarget.value })}
                className="rounded-lg"
            />
        </div>

        <div className="w-full flex flex-col gap-2">
            <label htmlFor="id_unidad_conversion">Unidad de conversion</label>
            <select
                id="id_unidad_conversion"
                name="id_unidad_conversion"
                value={unidad.id_unidad_conversion}
                onChange={(e) => setUnidad({ ...unidad, id_unidad_conversion: Number(e.currentTarget.value) })}
                className="rounded-lg"
            >
                <option value="">Seleccione una unidad de conversion</option>
                {unidades.map((u) => (
                    <option key={u.id} value={u.id}>{u.unidad}</option>
                ))}
            </select>
        </div>
        {unidad.id_unidad_conversion && (
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="conversion">Conversion</label>
                <input
                    type="number"
                    id="conversion"
                    name="conversion"
                    placeholder="Ingrese una conversion"
                    value={unidad.conversion}
                    onChange={(e) => setUnidad({ ...unidad, conversion: Number(e.currentTarget.value) })}
                    className="rounded-lg"
                />
            </div>
        )}
    </>)
};
