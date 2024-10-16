'use client'

import { Parametro } from "@/utils/types";
import { IconTrash } from "@tabler/icons-react";
import BotonEditarParametro from "./BotonEditarParametro";
import CampoParametro from "./CampoParametro";
import { Each } from "./EachOf";
import { Boton } from "./Botones";

interface ListaParametrosProps {
    parametros: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
    sesion: string;
}

export default function ListaParametros({ parametros, setParametros, sesion }: ListaParametrosProps) {
    const BotonEliminar = ({ id }: { id: number }) => {
        const EliminarParametro = () => {
            const nuevosParametros = parametros.filter((parametro) => parametro.id !== id);
            setParametros && setParametros(nuevosParametros);
        }
        return (
            <Boton
                type="danger"
                funcion={EliminarParametro}
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
                    <CampoParametro key={parametro.id} parametro={parametro} />
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