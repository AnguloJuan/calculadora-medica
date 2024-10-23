'use client'

import { obtenerUnidadesPorParametroAction } from "@/utils/actions";
import { Parametro, UnidadPorParametro } from "@/utils/types";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import BotonEditarParametro from "./BotonEditarParametro";
import { Boton } from "./Botones";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";

interface ListaParametrosProps {
    parametros: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
    sesion: string;
}

export default function ListaParametros({ parametros, setParametros, sesion }: ListaParametrosProps) {
    const [unidadesPorParametro, setUnidadesPorParametro] = useState<UnidadPorParametro[]>([]);
    useEffect(() => {
        const formData = new FormData();
        for (let i = 0; i < parametros.length; i++) {
            formData.append('parametroIds', parametros[i].id.toString());
        }
        obtenerUnidadesPorParametroAction(formData)
            .then(data => {
                if ('error' in data) {
                    console.error(data.error);
                } else {
                    setUnidadesPorParametro(data);
                }
            })
            .catch(error => console.error(error));
    }, [parametros]);

    const BotonEliminar = ({ id }: { id: number }) => {
        const EliminarParametro = () => {
            const nuevosParametros = parametros.filter((parametro) => parametro.id !== id);
            setParametros && setParametros(nuevosParametros);
        }
        return (
            <Boton
                type="button"
                variante="danger"
                onClick={EliminarParametro}
            >
                <IconTrash stroke={2} />
            </Boton>
        );
    }

    return (
        <div className="flex flex-col w-full gap-10">
            <Each
                of={parametros}
                render={(parametro) => (<div className="flex flex-row gap-2">
                    <CampoParametro key={parametro.id} parametro={parametro} setParametros={setParametros} unidades={
                        unidadesPorParametro.find((unidad) => unidad.id_parametro === parametro.id)?.unidades || []
                    } />
                    {sesion === 'admin' && (
                        <div className="flex flex-row gap-1">
                            <BotonEliminar id={parametro.id} />
                            <BotonEditarParametro parametro={parametro} parametros={parametros} setParametros={setParametros} />
                        </div>
                    )}
                </div>)}
            />
        </div>
    );
}