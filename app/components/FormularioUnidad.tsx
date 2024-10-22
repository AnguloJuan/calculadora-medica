'use client'

import { Unidad, UnidadZ } from "@/utils/types";
import { Boton } from "./Botones";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ActualizarUnidadesAction, crearUnidadAction, ObtenerUnidadesAction } from "@/utils/actions";
import { Each } from "./EachOf";
import { useToast } from "./Toast";
import { z } from "@/utils/es-zod";
import { ReactSelect } from "./CustomSelect";
import { ActionMeta } from "react-select";

interface FormularioUnidadProps {
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    setAbierto?: (abierto: boolean) => void;
    setFetchUnidades?: (fetchUnidades: boolean) => void;
    shouldClose: boolean;
}

export default function FormularioUnidad({ setFieldValue, setAbierto, setFetchUnidades }: FormularioUnidadProps) {
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [doFethcUnidades, setDoFetchUnidades] = useState<boolean>(true);
    const [fetching, setFetching] = useState(true);
    const { addToast } = useToast();
    useEffect(() => {
        setFetching(true);
        ObtenerUnidadesAction()
            .then(data => setUnidades(data))
            .catch(error => console.error(error))
            .finally(() => setFetching(false));
        setDoFetchUnidades(false)
    }, [doFethcUnidades])

    const unidadSchema = UnidadZ;
    const initialValues: z.infer<typeof unidadSchema> = {
        id: 0,
        unidad: '',
        conversion: undefined,
        id_unidad_conversion: undefined
    }

    const handleSubmit = async (values: z.infer<typeof unidadSchema>) => {
        const formData = new FormData();
        formData.append('unidad', values.unidad);
        formData.append('conversion', values.conversion ? values.conversion.toString() : '');
        formData.append('id_unidad_conversion', values.id_unidad_conversion ? values.id_unidad_conversion.toString() : '0');

        const resultado = crearUnidadAction(formData);
        resultado.then((res) => {
            if (res.error) {
                console.error(res.error);
                addToast('Error al crear la unidad', 'error');
                return;
            }

            // Actualizar el estado de las unidades en el formulario padre
            setFieldValue &&
                setFieldValue('unidades', [...unidades,
                { id: res.id, unidad: values.unidad, conversion: values.conversion, id_unidad_conversion: values.id_unidad_conversion }
                ]);
            setFetchUnidades ? setFetchUnidades(true) : setDoFetchUnidades(true);
            setAbierto && setAbierto(false);

            ActualizarUnidadesAction();
            addToast('Unidad creada correctamente', 'success');
        })
    }

    return (<>
        <div className="w-full flex flex-col gap-2">
            <Formik
                initialValues={initialValues}
                validate={withZodSchema(unidadSchema)}
                onSubmit={handleSubmit}

            >
                {({ values, setFieldValue }) => (
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
                        {fetching ? (<p>Cargando...</p>) : unidades.length > 0 ?
                            (<div className="w-full flex flex-col gap-2">
                                <label htmlFor="id_unidad_conversion">Unidad de conversion</label>
                                <ReactSelect
                                    id="id_unidad_conversion"
                                    name="id_unidad_conversion"
                                    options={unidades.map((unidad) => {
                                        return { label: unidad.unidad, value: unidad.id }
                                    })}
                                    onChange={(value: any, actionMeta: ActionMeta<any>) => {
                                        setFieldValue('id_unidad_conversion', value.value)
                                    }}
                                />
                                <ErrorMessage component="p" name="id_unidad_conversion" />
                            </div>) : <p>No hay unidades para hacer conversión</p>}
                        {values.id_unidad_conversion && (
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="conversion">Conversion</label>
                                <Field
                                    type="number"
                                    name="conversion"
                                    placeholder="Ingrese la conversion con la unidad seleccionada"
                                />
                                <ErrorMessage component="p" name="conversion" />
                            </div>
                        )}
                        <div className="w-full flex flex-row justify-evenly">
                            <Boton
                                type="button"
                                tipo="danger"
                                onClick={() => setAbierto && setAbierto(false)}
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
