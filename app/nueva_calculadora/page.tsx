export default async function Home() {
    return (
        <>
            <h1 className="text-2xl font-bold">Nueva calculadora</h1>
            <form className="flex min-h-screen flex-col items-center justify-between p-24">
                <p>Ingresar parametros</p>
                <input type="text" id="nombre" name="nombre" placeholder="Ingrese un nombre del parametro"></input>
                <input type="text" name="unidad_metrica" id="unidad_metrica" />
                
                <select name="tipo" id="tipo">
                    <option value="1">Numero</option>
                    <option value="2">Texto</option>
                    <option value="3">Fecha</option>
                </select>
            </form>
        </>
    );
}