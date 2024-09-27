import React from "react";
import { Parametro } from "@/utils/types";
import { BotonAgregar } from "./Botones";
import { Each } from "./EachOf";

interface AgregarParametroProps {
}

interface AgregarParametroState {

}

/**
* Constante de testeo sera eliminado en la version final
*/
const parametrosExistentes: Parametro[] = [
    { id: 1, nombre: 'Parametro 1', tipo: "numerico" },
    { id: 2, nombre: 'Parametro 2', tipo: 'seleccion' },
    { id: 3, nombre: 'Parametro 3', tipo: 'radio' },
];

class AgregarParametro extends React.Component<AgregarParametroProps, AgregarParametroState> {
    constructor(props: AgregarParametroProps) {
        super(props);
        // this.state = { : };
    }
    agregarParametro = () => {
        console.log('Agregando nuevo parametro');
    }

    render() {

        return (
            <div className="w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6 gap-8">
                <select name="parametrosExistentes" id="parametrosExistentes" className="col-span-4">
                    <option value="0">Seleccione un parámetro</option>
                    <Each
                        of={parametrosExistentes}
                        render={(parametro) => (
                            <option key={parametro.id} value={parametro.id}>
                                {parametro.nombre}
                            </option>
                        )}
                    />
                </select>
                <div className="w-full col-span-2">
                    <BotonAgregar funcion={this.agregarParametro}>Agregar nuevo parametro</BotonAgregar>
                </div>
            </div>
        );
    }
}

export default AgregarParametro;