import React from "react";
import ListaParametros from "./ListaParametros";
import { Parametro } from "@/utils/types";
import { BotonAgregar } from "./Botones";

interface AgregarParametroProps {
    parametrosExistentes: Parametro[];
}

interface AgregarParametroState {

}

class AgregarParametro extends React.Component<AgregarParametroProps, AgregarParametroState> {
    constructor(props: AgregarParametroProps) {
        super(props);
        // this.state = { : };
    }
    render() {
        const { parametrosExistentes } = this.props;
        const agregarParametro = () => {
            console.log('Agregando nuevo parametro');
        }
        return (
            <>
                <ListaParametros
                    parametrosExistentes={parametrosExistentes}
                />

                <BotonAgregar funcion={agregarParametro}>Agregar nuevo parametro</BotonAgregar>
            </>
        );
    }
}

export default AgregarParametro;