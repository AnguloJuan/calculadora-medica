'use client'

import { Unidad, UnidadZ } from "@/utils/types";
import { Boton } from "./Botones";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { IconPlus, IconX } from "@tabler/icons-react";
import { crearUnidadAction } from "@/utils/actions";
import { Each } from "./EachOf";

interface FormularioUnidadProps {
    unidadesParametro?: Unidad[];
    setUnidadesParametro?: (unidadesParametro: Unidad[]) => void;
    setAbierto: (abierto: boolean) => void;
    fetchUnidades: boolean;
    setFetchUnidades: (fetchUnidades: boolean) => void;
}

export default function FormularioUnidad({ unidadesParametro, setUnidadesParametro, setAbierto }: FormularioUnidadProps) {
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [fetchUnidades, setFetchUnidades] = useState(true);
    useEffect(() => {
        fetch('/api/unidades')
            .then(response => response.json())
            .then(data => setUnidades(data.unidades))
            .catch(error => console.error(error));
        setFetchUnidades(false);
    }, [fetchUnidades, setFetchUnidades])

    const unidadSchema = UnidadZ;
    const initialValues = {
        id: 0,
        unidad: '',
        conversion: undefined,
        id_unidad_conversion: undefined
    }

    return (<>
        <div className="w-full flex flex-col gap-2">
            <Formik
                initialValues={initialValues}
                validate={withZodSchema(unidadSchema)}
                onSubmit={values => {
                    const formData = new FormData();
                    formData.append('unidad', values.unidad);
                    formData.append('conversion', values.conversion ? values.conversion as string : '');
                    formData.append('id_unidad_conversion', values.id_unidad_conversion ? values.id_unidad_conversion as string : '');

                    const resultado = crearUnidadAction(formData);
                    resultado.then((res) => {
                        if (res.error) {
                            console.error(res.error);
                            return;
                        }
                        // unidadesParametro && setUnidadesParametro && setUnidadesParametro([...unidadesParametro, { id: res.id, unidad: values.unidad, conversion: values.conversion, id_unidad_conversion: values.id_unidad_conversion } as Unidad]);

                        setAbierto(false);
                    })
                }}

            >
                {({ values }) => (
                    <Form className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="unidad">Unidad</label>
                            <Field
                                type="text"
                                name="unidad"
                                placeholder="Ingrese una unidad"

                            />
                            <ErrorMessage component="p" name="unidad" />
                        </div>
                        {unidades.length !== 0 ? (<div className="w-full flex flex-col gap-2">
                            <label htmlFor="id_unidad_conversion">Unidad de conversion</label>
                            <Field
                                as="select"
                                name="id_unidad_conversion"
                            >
                                <option value="">Seleccione una unidad de conversion</option>
                                <Each of={unidades} render={
                                    (unidad: Unidad, index: number) => (
                                        <option key={index} value={unidad.id}>{unidad.unidad}</option>
                                    )} />
                            </Field>
                            <ErrorMessage component="p" name="id_unidad_conversion" />
                        </div>) : <p>No hay unidades para hacer conversión</p>}
                        {values.id_unidad_conversion && (
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="conversion">Conversion</label>
                                <Field
                                    type="number"
                                    name="conversion"
                                    placeholder="Ingrese una conversion"

                                />
                                <ErrorMessage component="p" name="conversion" />
                            </div>
                        )}
                        <div className="w-full flex flex-row justify-evenly">
                            <Boton
                                type="button"
                                tipo="danger"
                                onClick={() => setAbierto(false)}
                            >
                                <IconX stroke={2} />
                                Cancelar
                            </Boton>
                            <Boton type="submit" tipo="success">
                                <IconPlus stroke={2} />
                                Guardar
                            </Boton>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    </>)
};
