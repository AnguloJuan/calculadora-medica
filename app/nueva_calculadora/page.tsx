import { crearCalculadoraAction } from "@/utils/actions";
import obtenerParametros from "@/utils/parametros";
import { Parametro } from "@/utils/types";
import AgregarEvidencias from "./AgregarEvidencias";
import BotonGuardarCalculadora from "./BotonGuardarCalculadora";
import Parametros from "./Parametros";

export default async function NuevaCalculadora() {
    const listaParametros = await obtenerParametros();

    return (
        <div className="w-full items-center flex justify-center my-8">
            <form
                action={crearCalculadoraAction}
                id="form_calculadora"
                name="form_calculadora"
                className="flex min-h-screen md:max-w-screen-md lg:max-w-screen-lg flex-col items-center justify-between rounded-lg p-24 py-12 bg-white gap-16"
            >
                <div className="w-full flex flex-col gap-6">
                    <h2 className="w-full text-xl font-semibold text-center">Información general</h2>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="nombre">Nombre de la calculadora</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Ingrese el de la nombre"
                            className="rounded-lg"
                        />
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <span>Descripción</span>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            placeholder="Ingrese una descripcion de la calculadora"
                            className="bg-white"
                        ></textarea>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="descripcion_corta">Descripcion corta</label>
                        <input
                            type="text"
                            id="descripcion_corta"
                            name="descripcion_corta"
                            placeholder="Ingrese una descipción corta de la calculadora"
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <span>Resultados/Recomendaciones</span>
                        <textarea
                            name="resultados_recomendaciones"
                            id="resultados_recomendaciones"
                            placeholder="Ingrese recomendaciones de la calculadora"
                            className="bg-white"
                        ></textarea>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="area">Área a la que pertenece la calculadora</label>
                        <input
                            type="text"
                            id="area"
                            name="area"
                            placeholder="Ingrese el área a la que pertenece la calculadora"
                            className="rounded-lg"
                        />
                    </div>

                    <AgregarEvidencias />

                </div>


                <div className="w-full flex flex-col gap-6">
                    <h2 className="w-full text-xl font-semibold text-center">Parámetros</h2>

                    {Array.isArray(listaParametros) ? <Parametros listaParametros={listaParametros ? listaParametros : [] as Parametro[]} />
                        : <p>Cargando...</p>}

                    <div className="w-full">
                        <label htmlFor="formula">Formula</label>
                        <input
                            type="text"
                            name="formula"
                            id="formula"
                            placeholder="Ingrese la formula"
                            className="rounded-lg"
                        />
                    </div>
                </div>

                <BotonGuardarCalculadora />
            </form>
        </div>
    );
}