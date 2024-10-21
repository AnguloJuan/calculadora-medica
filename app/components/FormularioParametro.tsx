'use client'
import { z } from "@/utils/es-zod";
import { Parametro, ParametroZ, Unidad, UnidadZ } from "@/utils/types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FunctionComponent, useEffect, useState } from "react";
import CampoParametro from "./CampoParametro";
import BotonCrearUnidad from "./BotonCrearUnidad";
import Select from "react-tailwindcss-select";
import { Options, SelectValue } from "react-tailwindcss-select/dist/components/type";

interface FormularioParametroProps {
    parametros: Parametro[];
    setParametros: (parametros: Parametro[]) => void;
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = (FormularioParametroProps) => {
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [fetchUnidades, setFetchUnidades] = useState(true);
    useEffect(() => {
        fetch('/api/unidades')
            .then(response => response.json())
            .then(data => setUnidades(data.unidades))
            .catch(error => console.error(error));
        setFetchUnidades(false);
    }, [fetchUnidades, setFetchUnidades])

    const mySchema = ParametroZ.extend({
        unidades: z.array(UnidadZ),
    });

    const initialValues: z.infer<typeof mySchema> = {
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo_campo: 'numerico',
        unidades: [{ id: 0, unidad: '', conversion: undefined, id_unidad_conversion: undefined }],
        valorMaximo: undefined,
        valorMinimo: undefined,
        opciones: '',
    }


    const [unidad, setUnidad] = useState<SelectValue>({} as SelectValue);
    
    const options: Options = unidades.length !== 0 ? unidades.map((unidad) => {
        return { label: unidad.unidad, value: unidad.id.toString() }
    }) : [{ label: 'No hay unidades', value: '0' }];

    return (
        <Formik
            initialValues={initialValues}
            validate={withZodSchema(mySchema)}
            onSubmit={values => {
                // same shape as initial values
                console.log(values);
            }}
        >
            {({ values, handleBlur, setFieldValue, isSubmitting }) => (
                <Form className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="nombre">Nombre del parámetro</label>
                            <Field
                                type="text"
                                name="nombre"
                                placeholder="Ingrese un nombre del parametro"
                            />
                            <ErrorMessage component="p" name="nombre" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="abreviatura">Abreviatura</label>
                            <Field
                                type="text"
                                name="abreviatura"
                                placeholder="Ingrese una abreviatura de la calculadora"

                            />
                            <ErrorMessage component="p" name="abreviatura" />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="tipo_campo">Tipo de campo</label>
                        <Field
                            name="tipo_campo"
                            as="select"
                        >
                            <option value="numerico">Numerico</option>
                            <option value="seleccion">Selección</option>
                            <option value="radio">Radio</option>
                        </Field>
                        <ErrorMessage component="p" name="tipo_campo" />
                    </div>

                    {values.tipo_campo === 'numerico' && <>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="unidades">Unidad</label>
                            <Select
                                value={unidad}
                                options={options}
                                isMultiple={true}
                                onChange={(value) => setFieldValue}
                                primaryColor="blue"
                            />
                            <ErrorMessage component="p" name="unidades" />
                        </div>
                        <BotonCrearUnidad unidades={values.unidades} fetchUnidades={fetchUnidades} setFetchUnidades={setFetchUnidades} />

                        <div className="w-full sm:grid sm:grid-cols-2 sm:gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="minimo">Valor mínimo</label>
                                <Field
                                    type="number"
                                    id="valorMinimo"
                                    name="valorMinimo"
                                    placeholder="Ingrese el valor mínimo"

                                />
                                <ErrorMessage component="p" name="valorMinimo" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="maximo">Valor máximo</label>
                                <Field
                                    type="number"
                                    id="valorMaximo"
                                    name="valorMaximo"
                                    placeholder="Ingrese el valor máximo"

                                />
                                <ErrorMessage component="p" name="valorMaximo" />
                            </div>
                        </div>
                    </>}

                    {(values.tipo_campo === 'seleccion' || values.tipo_campo === 'radio') && <div className="w-full flex flex-col gap-2">
                        <label htmlFor="opciones">Opciones</label>
                        <label className="text-xs text-gray-500">Ingrese las opciones separadas por coma</label>
                        <Field
                            name="opciones"
                            placeholder="Ingrese las opciones separadas por coma"
                        />
                        <ErrorMessage component="p" name="opciones" />
                    </div>}

                    <div className="w-full flex flex-col gap-2 text-center">
                        <h2 className="font-semibold">Vista previa</h2>
                        <CampoParametro parametro={values as Parametro} />
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default FormularioParametro;