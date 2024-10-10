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
        tipo_campo: 'numerico',
        unidad_metrica: '',
        valorMaximo: 0,
        valorMinimo: 0,
        opciones: '',
    });

    const manejarCambio = (e: FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        datosFormulario.set(e.currentTarget.name, e.currentTarget.value);

        setParametro({
            ...parametro,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }


    const cambiarTipoCampo = (e: FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const valor = e.currentTarget.value;

        datosFormulario.set('tipo_campo', valor);
        (valor === 'numerico' || valor === 'seleccion' || valor === 'radio') && setParametro({
            ...parametro,
            tipo_campo: valor,
        });
    }

    return (<>
        <div className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
            <div className="w-full flex flex-row gap-4">
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
                    <label htmlFor="abreviatura">Abreviatura</label>
                    <input
                        type="text"
                        id="abreviatura"
                        name="abreviatura"
                        placeholder="Ingrese una abreviatura de la calculadora"
                        onChange={manejarCambio}
                        className="rounded-lg"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                <label htmlFor="tipo_campo">Tipo de campo</label>
                <select name="tipo_campo" id="tipo_campo" className="rounded-lg" onChange={cambiarTipoCampo}>
                    <option value="numerico">Numerico</option>
                    <option value="seleccion">Selección</option>
                    <option value="radio">Radio</option>
                </select>
            </div>

            {parametro.tipo_campo === 'numerico' && <>
                <div className="w-full sm:grid sm:grid-cols-3 sm:gap-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="unidad_metrica">Unidad</label>
                        <input
                            type="text"
                            id="unidad_metrica"
                            name="unidad_metrica"
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

            {(parametro.tipo_campo === 'seleccion' || parametro.tipo_campo === 'radio') && <div className="w-full flex flex-col gap-2">
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