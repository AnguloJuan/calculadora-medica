'use client'

import { Unidad, UnidadZ } from "@/utils/types";
import { Boton } from "./Botones";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { IconPlus, IconX } from "@tabler/icons-react";
import { crearUnidadAction } from "@/utils/actions";
import { Each } from "./EachOf";
import { useToast } from "./Toast";

interface FormularioUnidadProps {
    onChange: (e: any) => void;
    setAbierto: (abierto: boolean) => void;
    fetchUnidades: boolean;
    setFetchUnidades: (fetchUnidades: boolean) => void;
}

export default function FormularioUnidad({ onChange, setAbierto, fetchUnidades, setFetchUnidades }: FormularioUnidadProps) {
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [doFethcUnidades, setDoFetchUnidades] = useState<boolean>(fetchUnidades || true);
    const { addToast } = useToast();
    useEffect(() => {
        fetch('/api/unidades')
            .then(response => response.json())
            .then(data => setUnidades(data.unidades))
            .catch(error => console.error(error));
        setFetchUnidades && setFetchUnidades(false);
        setDoFetchUnidades(false)
    }, [setDoFetchUnidades, setFetchUnidades, doFethcUnidades])

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
                            addToast('Error al crear la unidad', 'error');
                            return;
                        }


                        setFetchUnidades(true);
                        addToast('Unidad creada correctamente', 'success');
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
