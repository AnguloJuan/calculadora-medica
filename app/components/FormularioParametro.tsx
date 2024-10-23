'use client'
import { crearParametroAction, ObtenerUnidadesAction } from "@/utils/actions";
import { z } from "@/utils/es-zod";
import { Parametro, ParametroZ, Unidad, UnidadZ } from "@/utils/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FunctionComponent, use, useEffect, useState } from "react";
import BotonCrearUnidad from "./BotonCrearUnidad";
import { Boton } from "./Botones";
import CampoParametro from "./CampoParametro";
import { ReactSelect } from "./CustomSelect";
import { useToast } from "./Toast";


interface FormularioParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
    setAbierto: (abierto: boolean) => void;
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = ({ parametros, setParametros, setAbierto }: FormularioParametroProps) => {
    const { addToast } = useToast();
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [fetchUnidades, setFetchUnidades] = useState(true);
    const [fetching, setFetching] = useState(true);
    const [opciones, setOpciones] = useState<{ value: Unidad, label: string }[]>([]);
    const [seleccionado, setSeleccionado] = useState<Unidad | null>(null);

    useEffect(() => {
        setFetching(true);
        ObtenerUnidadesAction()
            .then(data => setUnidades(data))
            .catch(error => console.error(error))
            .finally(() => setFetching(false));
        setFetchUnidades(false);
    }, [fetchUnidades, setFetchUnidades])

    useEffect(() => {
        setOpciones(unidades.map(unidad => ({ value: unidad, label: unidad.unidad })));
    }, [unidades])

    // useEffect(() => {
    //     if (seleccionado) {
    //         setOpciones(opciones.filter(opcion => opcion.value.id_unidad_conversion !== seleccionado.id));
    //     } else {
    //         setOpciones(unidades.map(unidad => ({ value: unidad, label: unidad.unidad })));
    //     }
    // }, [opciones, unidades, seleccionado])

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

    const hendleSubmit = async (values: z.infer<typeof parametroSchema>) => {
        try {
            const datosParametro = new FormData();
            datosParametro.set('nombre', values.nombre);
            datosParametro.set('tipo_campo', values.tipo_campo);
            datosParametro.set('abreviatura', values.abreviatura?.toString() || '');
            datosParametro.set('valorMinimo', values.valorMinimo?.toString() || '');
            datosParametro.set('valorMaximo', values.valorMaximo?.toString() || '');
            datosParametro.set('opciones', values.opciones?.toString() || '');
            datosParametro.set('unidades', JSON.stringify(values.unidades.map(unidad => unidad.id)));

            values.unidades

            const respuesta = await crearParametroAction(datosParametro);
            if (respuesta.id) {
                const parametroConId = { ...values, id: respuesta.id };
                setParametros && parametros && setParametros([...parametros, parametroConId]);
                addToast(respuesta.message || 'Parámetro guardado con éxito', 'success');
                setAbierto(false);
            } else {
                addToast('Ocurrió un error inesperado en el servidor', 'error');
            }
        } catch (err) {
            addToast('Ocurrió un error inesperado', 'error');
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validate={withZodSchema(parametroSchema)}
            onSubmit={hendleSubmit}
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

                    {fetching ? (<p>Cargando...</p>) :
                        values.tipo_campo === 'numerico' && <>
                            <div className="w-full flex flex-row gap-2">
                                <ReactSelect
                                    name="unidades"
                                    options={opciones}
                                    noOptionsMessage={() => "No hay unidades disponibles"}
                                    isMulti={true}
                                    onBlur={handleBlur}
                                    placeholder={"Seleccione una unidad"}
                                    className="w-full"
                                    value={values.unidades.map(unidad => ({ value: unidad, label: unidad.unidad }))}
                                    onChange={(value: any) => {
                                        setFieldValue('unidades', value.map((unidad: { value: Unidad, label: string }) => unidad.value)); console.log(values);
                                    }}
                                />
                                <ErrorMessage component="p" name="unidades" />
                                <BotonCrearUnidad setFieldValue={setFieldValue} setFetchUnidades={setFetchUnidades} sholdClose />
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
                        <CampoParametro parametro={values as Parametro} unidades={values.unidades} />
                    </div>
                    <div className="w-full flex flex-row justify-evenly">
                        <Boton
                            type="button"
                            variante="danger"
                            onClick={() => setAbierto(false)}
                        >
                            <IconX stroke={2} />
                            Cancelar
                        </Boton>
                        <Boton type="submit" variante="success" disabled={isSubmitting}>
                            <IconPlus stroke={2} />
                            Guardar
                        </Boton>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default FormularioParametro;