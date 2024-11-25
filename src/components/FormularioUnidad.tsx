'use client'

import UnidadSchema from "@/validationSchemas/UnidadSchema";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { memo, useEffect, useState } from "react";
import { z } from "../lib/es-zod";
import { crearUnidadAction, obtenerUnidadesAction } from "../utils/actions";
import { Unidad } from "../utils/types";
import { Boton } from "./Botones";
import { Each } from "./EachOf";
import { useToast } from "./Toast";

interface FormularioUnidadProps {
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  unidadesParametro?: Unidad[];
  setOpciones?: (opciones: { value: Unidad, label: string }[]) => void;
  setAbierto?: (abierto: boolean) => void;
  shouldClose: boolean;
}

function FormularioUnidad({ setFieldValue, unidadesParametro, setOpciones, setAbierto, shouldClose }: FormularioUnidadProps) {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [fetching, setFetching] = useState(true);
  const { addToast } = useToast();
  useEffect(() => {
    setFetching(true);
    obtenerUnidadesAction()
      .then(data => {
        if (!('error' in data)) setUnidades(data)
      })
      .catch(error => console.error(error))
      .finally(() => setFetching(false));
  }, [])

  const initialValues: z.infer<typeof UnidadSchema> = {
    id: 0,
    unidad: '',
    conversion: undefined,
    id_unidad_conversion: undefined
  }

  const handleSubmit = async (values: z.infer<typeof UnidadSchema>) => {
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

      if (res.id) {
        const unidadCreada: Unidad = { id: res.id, unidad: values.unidad, conversion: values.conversion, id_unidad_conversion: values.id_unidad_conversion };
        setUnidades([...unidades, unidadCreada]);

        // Actualizar el estado de las unidades en el formulario crear parámetro
        const opciones = unidades.map((unidad) => ({ value: unidad, label: unidad.unidad }));
        setOpciones && unidadesParametro &&
          setOpciones([...opciones, { value: unidadCreada, label: unidadCreada.unidad }]);
        setFieldValue && unidadesParametro &&
          setFieldValue('unidades', [...unidadesParametro, unidadCreada]);

        setAbierto && setAbierto(false);
        addToast('Unidad creada correctamente', 'success');
      } else addToast('Error al crear unidad', 'success');
    })
  }

  return (<>
    <div className="w-full flex flex-col gap-2">
      <Formik
        initialValues={initialValues}
        validate={withZodSchema(UnidadSchema)}
        onSubmit={handleSubmit}

      >
        {({ values, setFieldValue }) => (
          <Form className="flex md:max-w-screen-md lg:max-w-screen-lg flex-col items-center rounded-lg p-12 py-12 bg-backgroud gap-8">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="unidad">Unidad</label>
              <Field
                type="text"
                name="unidad"
                placeholder="Ingrese una unidad"
                className='rounded-lg'
              />
              <ErrorMessage component="p" name="unidad" className="text-red-500 text-sm" />
            </div>
            {fetching ? (<p>Cargando...</p>) : unidades.length > 0 ?
              (<div className="w-full flex flex-col gap-2">
                <label htmlFor="id_unidad_conversion">Unidad de conversion</label>
                {/* <ReactSelect
                                    id="id_unidad_conversion"
                                    name="id_unidad_conversion"
                                    value={values.id_unidad_conversion ? { label: unidades.find((unidad) => unidad.id === values.id_unidad_conversion)?.unidad, value: values.id_unidad_conversion } : null}
                                    options={unidades.map((unidad) => {
                                        return { label: unidad.unidad, value: unidad.id }
                                    })}
                                    onChange={(value: any, actionMeta: ActionMeta<any>) => {
                                        setFieldValue('id_unidad_conversion', value.value)
                                    }}
                                /> */}
                <Field
                  as="select"
                  name="id_unidad_conversion"
                  className='rounded-lg'
                  onChange={(e: any) => setFieldValue('id_unidad_conversion', parseFloat(e.target.value))}
                >
                  <option value={0}>Selecciona la unidad para conversión</option>
                  <Each
                    of={unidades}
                    render={(unidad) => (
                      <option value={unidad.id}>{unidad.unidad}</option>
                    )}
                  />
                </Field>
                <ErrorMessage component="p" name="id_unidad_conversion" />
              </div>) : <p>No hay unidades para hacer conversión</p>}
            {values.id_unidad_conversion && (
              <div className="w-full flex flex-col gap-2">
                <label htmlFor="conversion">Conversion</label>
                <Field
                  type="number"
                  name="conversion"
                  className='rounded-lg'
                  value={values.conversion}
                  placeholder="Ingrese la conversion con la unidad seleccionada"
                />
                <ErrorMessage component="p" name="conversion" />
              </div>
            )}
            <div className="w-full flex flex-row justify-evenly">
              <Boton
                type="button"
                variante="danger"
                onClick={() => setAbierto && setAbierto(false)}
              >
                <IconX stroke={2} />
                Cancelar
              </Boton>
              <Boton type="submit" variante="success">
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

export default memo(FormularioUnidad);