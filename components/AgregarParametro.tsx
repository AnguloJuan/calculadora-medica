import React from "react";
import ListaParametros from "./ListaParametros";
import { Parametro } from "@/utils/types";
import { BotonAgregar } from "./Botones";
import { Each } from "./EachOf";

interface AgregarParametroProps {
}

interface AgregarParametroState {

}

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
            <>
                <select name="parametrosExistentes" id="parametrosExistentes">
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

                <BotonAgregar funcion={this.agregarParametro}>Agregar nuevo parametro</BotonAgregar>
            </>
        );
    }
}

export default AgregarParametro;