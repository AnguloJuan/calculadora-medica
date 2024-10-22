'use client'
import { z } from "@/utils/es-zod";
import { Parametro, ParametroZ, Unidad, UnidadZ } from "@/utils/types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FunctionComponent, useEffect, useState } from "react";
import CampoParametro from "./CampoParametro";
import { ReactSelect } from "./CustomSelect";
import DebugFormik from "./DebugFormik";
import BotonCrearUnidad from "./BotonCrearUnidad";
import { useToast } from "./Toast";
import { ObtenerUnidadesAction } from "@/utils/actions";


interface FormularioParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = (FormularioParametroProps) => {
    const { addToast } = useToast();
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [fetchUnidades, setFetchUnidades] = useState(true);
    useEffect(() => {
        ObtenerUnidadesAction()
            .then(data => setUnidades(data))
            .catch(error => console.error(error));
        setFetchUnidades(false);
    }, [fetchUnidades, setFetchUnidades])

    const parametroSchema = ParametroZ.extend({
        unidades: z.array(UnidadZ),
    });

    const initialValues: z.infer<typeof parametroSchema> = {
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo_campo: 'numerico',
        unidades: [],
        valorMaximo: undefined,
        valorMinimo: undefined,
        opciones: '',
    }



    const options = unidades.length !== 0 ? unidades.map((unidad: Unidad) => {
        return { label: unidad.unidad, value: JSON.stringify(unidad) }
    }) : [];

    // const hendleSubmit = async (values: Parametro) => {
    //     try {
    //         const datosParametro = new FormData();
    //         datosParametro.set('nombre', parametro.nombre);
    //         datosParametro.set('tipo_campo', parametro.tipo_campo);
    //         datosParametro.set('abreviatura', parametro.abreviatura?.toString() || '');
    //         datosParametro.set('valorMinimo', parametro.valorMinimo?.toString() || '');
    //         datosParametro.set('valorMaximo', parametro.valorMaximo?.toString() || '');
    //         datosParametro.set('opciones', parametro.opciones?.toString() || '');

    //         const respuesta = await crearParametroAction(datosParametro);
    //         if (respuesta.id) {
    //             const parametroConId = { ...parametro, id: respuesta.id };
    //             setParametro({ ...parametro, id: respuesta.id });
    //             setParametros && parametros && setParametros([...parametros, parametroConId]);
    //             addToast(respuesta.message || 'Parámetro guardado con éxito', 'success');
    //             setAbierto(false);
    //         } else {
    //             addToast('Ocurrió un error inesperado en el servidor', 'error');
    //         }
    //     } catch (err) {
    //         addToast('Ocurrió un error inesperado', 'error');
    //     }
    // }

    return (
        <Formik
            initialValues={initialValues}
            validate={withZodSchema(parametroSchema)}
            onSubmit={values => {

            }}
        >
            {({ values, setFieldValue, isSubmitting, handleBlur }) => (
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
                            <ReactSelect
                                name="unidades"
                                options={options}
                                noOptionsMessage={() => "No hay unidades disponibles"}
                                isMulti={true}
                                onBlur={handleBlur}
                                placeholder={"Seleccione una unidad"}
                                value={values.unidades.map((unidad: Unidad) => ({ label: unidad.unidad, value: JSON.stringify(unidad) }))}
                                onChange={(selectedOption: any) => {
                                    setFieldValue('unidades', selectedOption.map((option: any) => JSON.parse(option.value)))
                                }}
                            />
                            <ErrorMessage component="p" name="unidades" />
                            <BotonCrearUnidad setFieldValue={setFieldValue} fetchUnidades={fetchUnidades} setFetchUnidades={setFetchUnidades} sholdClose />
                        </div>

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
                    <DebugFormik {...values} />
                </Form>
            )}
        </Formik>
    );
}

export default FormularioParametro;