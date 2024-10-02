'use client'
import { Parametro } from "@/utils/types";
import { FormEvent, FunctionComponent, useState } from "react";
import CampoParametro from "./CampoParametro";

interface FormularioCrearParametroProps {
    datosFormulario: FormData;
}

const FormularioCrearParametro: FunctionComponent<FormularioCrearParametroProps> = (FormularioCrearParametroProps) => {
    const { datosFormulario } = FormularioCrearParametroProps;
    const [parametro, setParametro] = useState<Parametro>({
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo: 'numerico',
        unidad: '',
        valorMaximo: 0,
        valorMinimo: 0,
        opciones: '',
    });

    const manejarCambio = (e: FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        setParametro({
            ...parametro,
            [e.currentTarget.name]: e.currentTarget.value
        });
        datosFormulario.set(e.currentTarget.name, e.currentTarget.value);
    }


    const cambiarTipo = (e: FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const valor = e.currentTarget.value;

        valor === ('numerico' || 'seleccion' || 'radio') && setParametro({
            ...parametro,
            tipo: valor,
        });

        datosFormulario.set('tipo', valor);
    }

    return (<>
        <div className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 bg-white gap-8">
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="nombre">Nombre del parámetro</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese un nombre del parametro"
                    onChange={manejarCambio}
                    className="rounded-lg"
                />
            </div>

            <div className="w-full flex flex-col gap-2">
                <span>Abreviatura</span>
                <textarea
                    name="descripcion"
                    id="descripcion"
                    placeholder="Ingrese una descripcion de la calculadora"
                    onChange={manejarCambio}
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

            {parametro.tipo === 'numerico' && <>
                <div className="sm:grid sm:grid-cols-3 sm:gap-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="unidad">Unidad</label>
                        <input
                            type="text"
                            id="unidad"
                            name="unidad"
                            placeholder="Ingrese la unidad del parámetro"
                            onChange={manejarCambio}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="minimo">Valor mínimo</label>
                        <input
                            type="number"
                            id="valorMinimo"
                            name="valorMinimo"
                            placeholder="Ingrese el valor mínimo"
                            onChange={manejarCambio}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="maximo">Valor máximo</label>
                        <input
                            type="number"
                            id="valorMaximo"
                            name="valorMaximo"
                            placeholder="Ingrese el valor máximo"
                            onChange={manejarCambio}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </>}

            {(parametro.tipo === 'seleccion' || parametro.tipo === 'radio') && <div className="w-full flex flex-col gap-2">
                <label htmlFor="opciones">Opciones</label>
                <textarea
                    name="opciones"
                    id="opciones"
                    placeholder="Ingrese las opciones separadas por coma"
                    onChange={manejarCambio}
                    className="bg-white"
                ></textarea>
            </div>}

            <div className="w-full flex flex-col gap-2 text-center">
                <h2 className="font-semibold">Vista previa</h2>
                <CampoParametro parametro={parametro} />
            </div>
        </div>

    </>);
}

export default FormularioCrearParametro;