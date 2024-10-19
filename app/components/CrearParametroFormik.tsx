import React from 'react';
import { Formik, Form, Field } from 'formik';
import { z } from 'zod';
import { Boton } from './Botones';

const SignupSchema = Yup.object().shape({
    nombre: z.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    abreviatura: z.string()
        .min(2, 'Too Short!')
        .max(10, 'Too Long!')
        .required('Required'),
    tipo_campo: Yup.string().email('Invalid email').required('Required'),
});

export const ValidationSchemaExample = () => (
    <div>
        <h1>Agregar parametro</h1>
        <Formik
            initialValues={{
                nombre: '',
                abreviatura: '',
                tipo_campo: 'numerico',
                unidades: [],
                valorMaximo: undefined,
                valorMinimo: undefined,
                opciones: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                // same shape as initial values
                console.log(values);
            }}
        >
            {({ errors, touched }) => (
                <Form>
                    <Field name="nombre" />
                    {errors.nombre && touched.nombre ? (
                        <div>{errors.nombre}</div>
                    ) : null}
                    <Field name="abreviatura" />
                    {errors.abreviatura && touched.abreviatura ? (
                        <div>{errors.abreviatura}</div>
                    ) : null}
                    <Field name="tipo_campo" />
                    {errors.tipo_campo && touched.tipo_campo ? <div>{errors.tipo_campo}</div> : null}
                    <Boton type="submit" estilo='success'>Guardar</Boton>
                </Form>
            )}
        </Formik>
    </div>
);