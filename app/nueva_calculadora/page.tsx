// 'use client';

import ListaParametros from "@/app/components/ListaParametros";
import { crearCalculadoraAction } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { IconDeviceFloppy } from "@tabler/icons-react";
import BotonAgregarParametro from "../components/BotonAgregarParametro";
import AgregarParametro from "./AgregarParametro";
// import { useState } from "react";

export default function NuevaCalculadora() {
    const datosCalculadora = new FormData();

    let parametros: Parametro[] = [
        { id: 1, nombre: 'Peso', tipo: "numerico", abreviatura: 'Peso', unidad: 'Kg' },
        { id: 2, nombre: 'Parametro 2', tipo: 'seleccion', abreviatura: 'Parametro 2', opciones: 'Opcion 1,Opcion 2,Opcion 3' },
        { id: 3, nombre: 'Sexo', tipo: 'radio', abreviatura: 'Sexo', opciones: 'Masculino,Femenino' },
    ]


    // Guardar los datos en la nueva calculadora y redirigir a la pagina de la calculadora

    return (
        <div className="w-full items-center flex justify-center my-8">
            <form action={crearCalculadoraAction} className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-24 py-12 bg-white gap-16">
                <div className="w-full flex flex-col gap-6">
                    <h2 className="w-full text-xl font-semibold text-center">Información general</h2>
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
                        <span>Descripción</span>
                        <textarea
                            name="descripcion"
                            id="descripcion"
                            placeholder="Ingrese una descripcion de la calculadora"
                            className="bg-white"
                        ></textarea>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="descripcion_corta">Descripcion corta</label>
                        <input
                            type="text"
                            id="descipción_corta"
                            name="descipción_corta"
                            placeholder="Ingrese una descipción corta de la calculadora"
                            className="rounded-lg"
                        />
                    </div>
                </div>


                <div className="w-full flex flex-col gap-6">
                    <h2 className="w-full text-xl font-semibold text-center">Parámetros</h2>

                    <div className="w-full flex flex-col gap-2">
                        <span>Agregar parámetro</span>
                        <div className="w-full grid grid-cols-2 gap-y-8 sm:grid-cols-6 gap-8">
                            <AgregarParametro parametrosExistentes={parametros} />
                            <BotonAgregarParametro datosCalculadora={datosCalculadora} />
                        </div>
                    </div>
                    <ListaParametros parametros={parametros} />

                    <div className="w-full">
                        <label htmlFor="formula">Formula</label>
                        <input
                            type="text"
                            name="formula"
                            id="formula"
                            placeholder="Ingrese la formula"
                            className="rounded-lg"
                        />
                    </div>
                </div>


                <div className="w-full">
                    <h2 className="w-full text-xl font-semibold text-center">Evidencias</h2>
                    <label htmlFor="cita">Cita bibliográfica</label>
                    <input
                        type="text"
                        name="cita"
                        id="cita"
                        placeholder="Ingrese la cita en formato APA"
                        className="rounded-lg"
                    />
                </div>

                <button
                    className="flex flex-row bg-green-600 border-green-700 text-white px-4 py-2 rounded-lg items-center gap-2"
                >
                    <IconDeviceFloppy stroke={2} />
                    Guardar
                </button>
            </form>
        </div>
    );
}