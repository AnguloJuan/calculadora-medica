import { useState } from "react";

export default async function NuevaCalculadora() {
    // Datos de la calculadora
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [descripcionCorta, setDescripcionCorta] = useState('');
    const [parametros, setParametros] = useState([]);
    const [unidadMetrica, setUnidadMetrica] = useState('');
    const [formula, setFormula] = useState('');

    const [tipo, setTipo] = useState(1);

    // Presionar boton + para desplegar las opciones del tipo de parametros


    // Guardar los datos en la nueva calculadora y redirigir a la pagina de la calculadora

    return (
        <>
            <h1 className="text-2xl font-bold">Nueva calculadora</h1>
            <form className="flex min-h-screen flex-col items-center justify-between p-24">
                <h2>Información general</h2>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese un nombre del parametro"
                />

                <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Ingrese una descripcion de la calculadora"
                />
                <input
                    type="text"
                    id="descipción_corta"
                    name="descipción_corta"
                    placeholder="Ingrese una descipción corta de la calculadora"
                />

                <h2>Parámetros</h2>
                {/* en caso de texto */}
                <input type="text" id="nombre" name="nombre" placeholder="Ingrese un nombre del parametro"></input>
                <input type="text" id="unidad_metrica" name="unidad_metrica" placeholder="Ingrese la unidad o metrica que se usa para parametro"></input>

                <button type="button">+</button>
                <select name="tipo" id="tipo">
                    <option value="1">Texto</option>
                    <option value="2">Numérico</option>
                    <option value="3">Radio</option>
                    <option value="4">Check</option>
                    <option value="5">Select</option>
                </select>

                <input type="text" name="formula" id="formula" placeholder="Ingrese la formula" />

                <h2>Evidencias</h2>
                <input type="text" name="cita" id="cita" placeholder="Ingrese la cita en formato APA" />
            </form>
        </>
    );
}