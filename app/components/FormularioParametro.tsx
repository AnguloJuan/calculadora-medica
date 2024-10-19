'use client'
import { Parametro, ParametroZ, Unidad, UnidadZ } from "@/utils/types";
import { FormEvent, FunctionComponent, useState } from "react";
import CampoParametro from "./CampoParametro";
import Select from "react-tailwindcss-select";
import { Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { z } from "@/utils/es-zod";

interface FormularioParametroProps {
    parametros: Parametro[];
    setParametros: (parametros: Parametro[]) => void;
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = (FormularioParametroProps) => {
    const mySchema = ParametroZ.extend({
        unidades: z.array(UnidadZ).nonempty()
    });

    return (
        <Formik
            initialValues={{
                id: 0,
                nombre: '',
                abreviatura: '',
                tipo_campo: 'numerico',
                unidades: [],
                valorMaximo: undefined,
                valorMinimo: undefined,
                opciones: '',
            }}
            validationSchema={withZodSchema(mySchema)}
            onSubmit={values => {
                // same shape as initial values
                console.log(values);
            }}
        >
            {({ errors, touched }) => (
                <Form className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="nombre">Nombre del parámetro</label>
                            <Field
                                type="text"
                                name="nombre"
                                placeholder="Ingrese un nombre del parametro"
                                className="rounded-lg"
                            />
                            {errors.nombre && touched.nombre ? (
                                <div>{errors.nombre}</div>
                            ) : null}
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="abreviatura">Abreviatura</label>
                            <Field
                                type="text"
                                id="abreviatura"
                                name="abreviatura"
                                placeholder="Ingrese una abreviatura de la calculadora"
                                className="rounded-lg"
                            />
                            {errors.abreviatura && touched.abreviatura ? (
                                <div>{errors.abreviatura}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="tipo_campo">Tipo de campo</label>
                        <select
                            name="tipo_campo"
                            id="tipo_campo"
                            value={tipo_campo}
                            onChange={cambiarTipoCampo}
                            className="rounded-lg">
                            <option value="numerico">Numerico</option>
                            <option value="seleccion">Selección</option>
                            <option value="radio">Radio</option>
                        </select>
                    </div>

                    {tipo_campo === 'numerico' && <>
                        <div>
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="unidades">Unidad</label>
                            </div>

                        </div>
                        <div className="w-full sm:grid sm:grid-cols-2 sm:gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="minimo">Valor mínimo</label>
                                <input
                                    type="number"
                                    id="valorMinimo"
                                    name="valorMinimo"
                                    placeholder="Ingrese el valor mínimo"
                                    value={valorMinimo}
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
                                    value={valorMaximo}
                                    onChange={manejarCambio}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </>}

                    {(tipo_campo === 'seleccion' || tipo_campo === 'radio') && <div className="w-full flex flex-col gap-2">
                        <label htmlFor="opciones">Opciones</label>
                        <textarea
                            name="opciones"
                            id="opciones"
                            placeholder="Ingrese las opciones separadas por coma"
                            value={opciones}
                            onChange={manejarCambio}
                            className="bg-white"
                        ></textarea>
                    </div>}

                    <div className="w-full flex flex-col gap-2 text-center">
                        <h2 className="font-semibold">Vista previa</h2>
                        <CampoParametro parametro={parametro} />
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default FormularioParametro;