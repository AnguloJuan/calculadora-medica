import { Each } from "@/app/components/EachOf";
import TarjetaCalculadora from "@/app/components/tarjetaCalculadora";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora, CATEGORIAS } from "@/utils/types";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";

export default async function CategoriaPage({ params }: { params: { categoria: string } }) {
  const conexion = await conectarBd();
  async function obtenerCalculadoras() {
    interface RowsCalculadora extends RowDataPacket, Calculadora { }
    try {
      const [rows] = await conexion.query<RowsCalculadora[]>('SELECT * FROM calculadora WHERE categoria = ?', [params.categoria]);

      return rows;
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }

  const calculadoras: Calculadora[] = await obtenerCalculadoras();
  const categoria = params.categoria;
  const nombreCategoria = CATEGORIAS.find((categoria) => categoria.kebabCase === params.categoria)?.nombre;

  return (<>
    <div className="w-full rounded-none bg-white flex flex-col items-center min-h-full pt-4 gap-4">
      <h1 className="text-xl font-bold">{nombreCategoria}</h1>
      <div className="w-full flex flex-col items-center gap-4">
        <Each of={calculadoras} render={(calculadora) => {
          return (
            <TarjetaCalculadora {...calculadora} />
          )
        }} />
      </div>
    </div>
  </>)
}