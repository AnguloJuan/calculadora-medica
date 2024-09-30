'use client'
import { crearParametro } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { FormEvent, FunctionComponent, useState } from "react";

interface FormularioCrearParametroProps {
    /**
     * Datos del formulario que provienen al crear una nueva calculadora
     */
    // datosFormulario: FormData;
}

const FormularioCrearParametro: FunctionComponent<FormularioCrearParametroProps> = (FormularioCrearParametroProps) => {
    // const { datosFormulario } = FormularioCrearParametroProps;
    const [tipo, setTipo] = useState('');

    const cambiarTipo = (e: FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        
        setTipo(e.currentTarget.value);
    }

    return (<form action={crearParametro}
        className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-12 py-12 bg-white gap-16">
        <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="nombre">Nombre del parámetro</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese un nombre del parametro"
                    className="rounded-lg"
                />
            </div>

            <div className="w-full flex flex-col gap-2">
                <span>Abreviatura</span>
                <textarea
                    name="descripcion"
                    id="descripcion"
                    placeholder="Ingrese una descripcion de la calculadora"
                    className="bg-white"
                ></textarea>
            </div>

            <div className="w-full flex flex-col gap-2">
                <label htmlFor="tipo">Tipo de campo</label>
                <select name="tipo" id="tipo" className="rounded-lg" onChange={cambiarTipo}>
                    <option value="numerico">Numerico</option>
                    <option value="seleccion">Selección</option>
                    <option value="radio">Radio</option>
                </select>
            </div>

            

        </div>
    </form>);
}

export default FormularioCrearParametro;