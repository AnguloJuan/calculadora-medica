'use client'
import { crearParametro } from "@/utils/actions";
import { Parametro } from "@/utils/types";
import { FormEvent, FunctionComponent, useState } from "react";

interface FormularioCrearParametroProps {
    /**
     * Datos del formulario que provienen al crear una nueva calculadora
     */
    // datosFormulario: FormData;
}

const FormularioCrearParametro: FunctionComponent<FormularioCrearParametroProps> = (FormularioCrearParametroProps) => {
    // const { datosFormulario } = FormularioCrearParametroProps;
    const [tipo, setTipo] = useState('numerico');
    const [parametros, setParametros] = useState<Parametro>({
        id: 0,
        nombre: '',
        abreviatura: '',
        tipo: 'numerico',
        unidad: '',
        valorMaximo: 0,
        valorMinimo: 0,
        opciones: '',
    });

    const manejarCambio = (e: FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();

        setParametros({
            ...parametros,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }


    const cambiarTipo = (e: FormEvent<HTMLSelectElement>) => {
        e.preventDefault();

        setTipo(e.currentTarget.value);
    }

    return (<form action={crearParametro}
        className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-12 py-12 bg-white gap-16">
        <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-2">
                <label htmlFor="nombre">Nombre del parámetro</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese un nombre del parametro"
                    onChange={manejarCambio}
                    className="rounded-lg"
                />
            </div>

            <div className="w-full flex flex-col gap-2">
                <span>Abreviatura</span>
                <textarea
                    name="descripcion"
                    id="descripcion"
                    placeholder="Ingrese una descripcion de la calculadora"
                    onChange={manejarCambio}
                    className="bg-white"
                ></textarea>
            </div>

            <div className="w-full flex flex-col gap-2">
                <label htmlFor="tipo">Tipo de campo</label>
                <select name="tipo" id="tipo" className="rounded-lg" onChange={cambiarTipo}>
                    <option value="numerico">Numerico</option>
                    <option value="seleccion">Selección</option>
                    <option value="radio">Radio</option>
                </select>
            </div>

            {tipo === 'numerico' && <>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="unidad">Unidad</label>
                    <input
                        type="text"
                        id="unidad"
                        name="unidad"
                        placeholder="Ingrese la unidad del parámetro"
                        onChange={manejarCambio}
                        className="rounded-lg"
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="minimo">Valor mínimo</label>
                    <input
                        type="number"
                        id="minimo"
                        name="minimo"
                        placeholder="Ingrese el valor mínimo"
                        onChange={manejarCambio}
                        className="rounded-lg"
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="maximo">Valor máximo</label>
                    <input
                        type="number"
                        id="maximo"
                        name="maximo"
                        placeholder="Ingrese el valor máximo"
                        onChange={manejarCambio}
                        className="rounded-lg"
                    />
                </div>
            </>}

            {(tipo === 'seleccion' || tipo === 'radio') && <div className="w-full flex flex-col gap-2">
                <label htmlFor="opciones">Opciones</label>
                <textarea
                    name="opciones"
                    id="opciones"
                    placeholder="Ingrese las opciones separadas por coma"
                    onChange={manejarCambio}
                    className="bg-white"
                ></textarea>
            </div>}

            <h2 className="font-semibold">Vista previa</h2>
            {tipo === 'numerico' && <>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="minimo">{parametros.nombre}</label>
                    <input
                        type="number"
                        id={`parametro-${parametros.nombre}`}
                        name={`parametro-${parametros.nombre}`}
                        placeholder="Ingrese el valor"
                        className="rounded-lg"
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="unidad">Unidad</label>
                    <span className="rounded-lg bg-gray-100 p-2">{parametros.unidad}</span>
                </div>
            </>}
            {(tipo === 'seleccion' || tipo === 'radio') && <>
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="opciones">Opciones</label>
                    <select name={`parametro-${parametros.nombre}`} id={`parametro-${parametros.nombre}`} className="rounded-lg">
                        <option value="0">Seleccione una opción</option>
                        {parametros.opciones?.split(',').map((opcion, index) =>
                            <option key={index} value={opcion}>{opcion}</option>
                        )}
                    </select>
                </div>
            </>}
        </div>

    </form>);
}

export default FormularioCrearParametro;