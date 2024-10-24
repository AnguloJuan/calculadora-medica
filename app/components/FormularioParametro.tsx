'use client'
import { crearParametroAction, obtenerUnidadesAction } from "@/utils/actions";
import { z } from "@/utils/es-zod";
import { Parametro, ParametroZ, Unidad, UnidadZ } from "@/utils/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FunctionComponent, useEffect, useState } from "react";
import BotonCrearUnidad from "./BotonCrearUnidad";
import { Boton } from "./Botones";
import CampoParametro from "./CampoParametro";
import { ReactSelect } from "./CustomSelect";
import { useToast } from "./Toast";
import { ParametroNumerico as ParametroNumericoSchema, ParametroSeleccion as ParametroSeleccionSchema } from "@/utils/validationSchema";


interface FormularioParametroProps {
    parametros?: Parametro[];
    setParametros?: (parametros: Parametro[]) => void;
    setAbierto: (abierto: boolean) => void;
}

const FormularioParametro: FunctionComponent<FormularioParametroProps> = ({ parametros, setParametros, setAbierto }: FormularioParametroProps) => {
    const { addToast } = useToast();
    const [fetching, setFetching] = useState(true);
    const [opciones, setOpciones] = useState<{ value: Unidad, label: string }[]>([]);
    const [seleccionado, setSeleccionado] = useState<Unidad | null>(null);

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

    type parametroSchema = typeof ParametroNumericoSchema | typeof ParametroSeleccionSchema
    const initialValues: z.infer<parametroSchema> = {
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo_campo: 'numerico',
        unidades: [],
        valorMaximo: undefined,
        valorMinimo: undefined,
        opciones: '',
    }

    const hendleSubmit = async (values: z.infer<parametroSchema>) => {
        try {
            const datosParametro = new FormData();
            datosParametro.set('nombre', values.nombre);
            datosParametro.set('tipo_campo', values.tipo_campo);
            datosParametro.set('abreviatura', values.abreviatura?.toString() || '');
            if (values.tipo_campo === 'numerico') {
                datosParametro.set('valorMinimo', values.valorMinimo?.toString() || '');
                datosParametro.set('valorMaximo', values.valorMaximo?.toString() || '');
                datosParametro.set('unidades', JSON.stringify(values.unidades.map(unidad => unidad.id)));
            } else datosParametro.set('opciones', values.opciones?.toString() || '');

            const respuesta = await crearParametroAction(datosParametro);
            console.log(1);

            // if (respuesta.id) {
            //     const parametroConId = { ...values, id: respuesta.id };
            //     setParametros && parametros && setParametros([...parametros, parametroConId]);
            //     addToast('Parámetro guardado con éxito', 'success');
            //     setAbierto(false);
            // } else {
            //     addToast('Ocurrió un error inesperado en el servidor', 'error');
            // }
        } catch (err) {
            addToast('Ocurrió un error inesperado', 'error');
        }
    }

    const handleValidation = (values: z.infer<parametroSchema>) => {
        if (values.tipo_campo === 'numerico') {
            return withZodSchema(ParametroNumericoSchema)(values);
        } else {
            return withZodSchema(ParametroSeleccionSchema)(values);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validate={handleValidation}
            onSubmit={hendleSubmit}
        >
            {({ values, setFieldValue, handleBlur, isSubmitting, dirty, isValid, errors }) => (
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
                            <ErrorMessage component="p" name="nombre" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="abreviatura">Abreviatura</label>
                            <Field
                                type="text"
                                name="abreviatura"
                                placeholder="Ingrese una abreviatura de la calculadora"
                                className={"rounded-lg"}
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
                            <ErrorMessage component="p" name="unidades" />


                            <div className="w-full sm:grid sm:grid-cols-2 sm:gap-2">
                                <div className="w-full flex flex-col gap-2">
                                    <label htmlFor="minimo">Valor mínimo</label>
                                    <Field
                                        type="number"
                                        id="valorMinimo"
                                        name="valorMinimo"
                                        placeholder="Ingrese el valor mínimo"
                                        value={values.valorMinimo}
                                        className={"rounded-lg"}
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
                                        value={values.valorMaximo}
                                        className={"rounded-lg"}
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
                            value={values.opciones}
                            className={"rounded-lg"}
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
                        <Boton type="submit" variante={isSubmitting || dirty || !isValid ? 'disabled' : 'success'} disabled={isSubmitting || dirty || !isValid}>
                            <IconPlus stroke={2} />
                            Guardar
                        </Boton>
                    </div>
                    <span>{JSON.stringify(errors)}</span>
                </Form>
            )}
        </Formik>
    );
}

export default FormularioParametro;