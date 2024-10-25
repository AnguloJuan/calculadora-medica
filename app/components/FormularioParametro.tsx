'use client'
import { actualizarParametrosServidorAction, crearParametroAction, editarParametroAction, obtenerUnidadesAction } from "@/utils/actions";
import { Parametro, Unidad } from "@/utils/types";
import { ParametroNumerico as ParametroNumericoSchema, ParametroSeleccion as ParametroSeleccionSchema } from "@/utils/validationSchema";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from "react";
import BotonCrearUnidad from "./BotonCrearUnidad";
import { Boton } from "./Botones";
import CampoParametro from "./CampoParametro";
import { ReactSelect } from "./CustomSelect";
import { useToast } from "./Toast";


interface FormularioParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
    setAbierto: (abierto: boolean) => void;
    accion?: 'guardar' | 'actualizar';
    parametro?: Parametro;
    unidadesParametro?: Unidad[];
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = ({ parametros, setParametros, setAbierto, accion, parametro, unidadesParametro }: FormularioParametroProps) => {
    const { addToast } = useToast();
    const [fetching, setFetching] = useState(true);
    const [opciones, setOpciones] = useState<{ value: Unidad, label: string }[]>([]);
    const [seleccionado, setSeleccionado] = useState<Unidad | null>(null);

    // const unidades = useMemo(async () => {
    //     setFetching(true);
    //     return obtenerUnidadesAction()
    //         .then(data => {
    //             if (!('error' in data)) {
    //                 return data;
    //             }
    //         })
    //         .catch(error => console.error(error))
    //         .finally(() => setFetching(false));
    // }, []) Necesita context o refetch para funcionar, ya no cambiara al crear una nueva unidad 

    // useEffect(() => {
    //     unidades.then(data => {
    //         if (data) {
    //             setOpciones(data.map(unidad => ({ value: unidad, label: unidad.unidad })));
    //         }
    //     });
    // }, [unidades])

    useEffect(() => {
        setFetching(true);
        obtenerUnidadesAction()
            .then(data => {
                if (!('error' in data)) setOpciones(data.map(unidad => ({ value: unidad, label: unidad.unidad })));
            })
            .catch(error => console.error(error))
            .finally(() => setFetching(false));
    }, [])

    // useEffect(() => { // cuando se selecciona una unidad, se elimina de las opciones que no sean conversiones
    //     if (seleccionado) {
    //         setOpciones(opciones.filter(opcion => opcion.value.id_unidad_conversion !== seleccionado.id));
    //     } else {
    //         setOpciones(unidades.map(unidad => ({ value: unidad, label: unidad.unidad })));
    //     }
    // }, [opciones, unidades, seleccionado])

    interface parametroSchema extends Parametro {
        unidades: Unidad[];
    }
    const parametroInicial = useMemo(() => parametro ? { ...parametro, unidades: unidadesParametro || [] } : undefined, [parametro, unidadesParametro]);
    const initialValues: parametroSchema = parametroInicial || {
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo_campo: 'numerico',
        unidades: [],
        valorMaximo: undefined,
        valorMinimo: undefined,
        opciones: '',
    }

    const hendleSubmit = useCallback(async (values: parametroSchema) => {
        const datosParametro = new FormData();
        datosParametro.set('nombre', values.nombre);
        datosParametro.set('tipo_campo', values.tipo_campo);
        datosParametro.set('abreviatura', values.abreviatura?.toString() || '');
        if (values.tipo_campo === 'numerico') {
            datosParametro.set('valorMinimo', values.valorMinimo?.toString() || '');
            datosParametro.set('valorMaximo', values.valorMaximo?.toString() || '');
            datosParametro.set('unidades', JSON.stringify(values.unidades));
        } else datosParametro.set('opciones', values.opciones?.toString() || '');

        let respuesta
        try {
            if (accion === 'guardar') {
                respuesta = await crearParametroAction(datosParametro);
                if (respuesta.id) {
                    const parametroConId: Parametro = { ...values, id: respuesta.id };
                    setParametros && parametros && setParametros([...parametros, parametroConId]);
                    addToast('Parámetro guardado con éxito', 'success');
                    await actualizarParametrosServidorAction();
                    setAbierto(false);
                }
            } else if (accion === 'actualizar') {
                respuesta = await editarParametroAction(datosParametro);
                if (respuesta.status === 200) {
                    if (parametros && setParametros) {
                        const nuevosParametros = parametros.map(param => param.id === values.id ? values : param);
                        setParametros(nuevosParametros);
                    }
                    addToast('Parámetro actualizado con éxito', 'success');
                    setAbierto(false);
                }
            } else {
                console.error('No se ha especificado una acción válida');
            }
        } catch (err) {
            addToast('Ocurrió un error inesperado', 'error');
        }
    }, [accion, addToast, parametros, setParametros, setAbierto])

    const handleValidation = useCallback((values: any) => {
        // todo: validar que las unidades sean únicas, que el valor mínimo sea menor que el máximo
        if (values.tipo_campo === 'numerico') {
            return withZodSchema(ParametroNumericoSchema)(values);
        } else {
            return withZodSchema(ParametroSeleccionSchema)(values);
        }
    }, [])

    return (
        <Formik
            initialValues={initialValues}
            validate={handleValidation}
            onSubmit={hendleSubmit}
        >
            {({ values, setFieldValue, handleBlur, isSubmitting, dirty, isValid, errors, touched }) => (
                <Form className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-white gap-8">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="nombre">Nombre del parámetro</label>
                            <Field
                                type="text"
                                name="nombre"
                                placeholder="Ingrese un nombre del parametro"
                                className={"rounded-lg"}
                            />
                            <ErrorMessage component="p" name="nombre" className='text-red-500 text-sm' />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="abreviatura">Abreviatura</label>
                            <Field
                                type="text"
                                name="abreviatura"
                                placeholder="Ingrese una abreviatura de la calculadora"
                                className={"rounded-lg"}
                            />
                            <ErrorMessage component="p" name="abreviatura" className='text-red-500 text-sm' />
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
                        <ErrorMessage component="p" name="tipo_campo" className='text-red-500 text-sm' />
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
                                    value={(values.unidades ?? []).map(unidad => ({ value: unidad, label: unidad.unidad }))}
                                    onChange={(value: any) =>
                                        setFieldValue('unidades', value.map((unidad: { value: Unidad, label: string }) => unidad.value))
                                    }
                                />
                                <BotonCrearUnidad
                                    setFieldValue={setFieldValue}
                                    unidadesParametro={values.unidades}
                                    setOpciones={setOpciones}
                                    shouldClose={true}
                                />
                            </div>
                            {errors.unidades ? (
                                <p className="text-red-500 text-sm">{Array.isArray(errors.unidades) ? errors.unidades.join(', ') : errors.unidades}</p>
                            ) : null}


                            <div className="w-full sm:grid sm:grid-cols-2 sm:gap-2">
                                <div className="w-full flex flex-col gap-2">
                                    <label htmlFor="minimo">Valor mínimo</label>
                                    <Field
                                        type="number"
                                        id="valorMinimo"
                                        name="valorMinimo"
                                        placeholder="Ingrese el valor mínimo"
                                        value={values.valorMinimo === null ? undefined : values.valorMinimo}
                                        className={"rounded-lg"}
                                        onChange={(e: any) => setFieldValue('valorMinimo',
                                            e.target.value === '' ? undefined : parseFloat(e.target.value))
                                        }
                                    />
                                    <ErrorMessage component="p" name="valorMinimo" className='text-red-500 text-sm' />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label htmlFor="maximo">Valor máximo</label>
                                    <Field
                                        type="number"
                                        id="valorMaximo"
                                        name="valorMaximo"
                                        placeholder="Ingrese el valor máximo"
                                        value={values.valorMaximo === null ? '' : values.valorMaximo}
                                        className={"rounded-lg"}
                                        onChange={(e: any) => setFieldValue('valorMaximo',
                                            e.target.value === '' ? undefined : parseFloat(e.target.value))
                                        }
                                    />
                                    <ErrorMessage component="p" name="valorMaximo" className='text-red-500 text-sm' />
                                </div>
                            </div>
                        </>}

                    {(values.tipo_campo === 'seleccion' || values.tipo_campo === 'radio') && <div className="w-full flex flex-col gap-2">
                        <label htmlFor="opciones">Opciones</label>
                        <label className="text-xs text-gray-500">Ingrese las opciones separadas por coma</label>
                        <Field
                            name="opciones"
                            placeholder="Ingrese las opciones separadas por coma"
                            value={values.opciones === null ? '' : values.opciones}
                            className={"rounded-lg"}
                        />
                        <ErrorMessage component="p" name="opciones" className='text-red-500 text-sm' />
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
                        <Boton
                            type="submit"
                            variante={isSubmitting || !isValid ? 'disabled' : accion === 'guardar' ? 'success' : 'warning'}
                            disabled={isSubmitting || !isValid}>
                            {accion === 'guardar' ? (<>
                                <IconPlus stroke={2} />
                                Guardar
                            </>) : (<>
                                <IconPencil stroke={2} />
                                Actualizar
                            </>)}
                        </Boton>
                    </div>
                    {<pre>{JSON.stringify(errors, null, 2)}</pre>}
                </Form>
            )}
        </Formik>
    );
}

export default memo(FormularioParametro);