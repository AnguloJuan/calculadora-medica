import { Each } from "@/app/components/EachOf";
import TarjetaCalculadora from "@/app/components/tarjetaCalculadora";
import { conectarBd } from "@/db/conectarDb";
import { Calculadora } from "@/utils/types";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";

export default async function CategoriaPage({ params }: { params: { categoria: string } }) {
  const conexion = await conectarBd();
  async function obtenerCalculadoras() {
    interface RowsCalculadora extends RowDataPacket, Calculadora { }
    try {
      const [rows] = await conexion.query<RowsCalculadora[]>('SELECT * FROM calculadora WHERE categoria = ?', [params.categoria]);

      if (rows.length === 0) {
        redirect('/404');
      }

      return rows;
    } catch (error) {
      console.error(error);
      redirect('/404');
    }
  }

  const calculadoras: Calculadora[] = await obtenerCalculadoras();

  return (<>
    <h1 className="text-xl font-bold">{params.categoria}</h1>
    <div className="w-full flex flex-col gap-4">
      <Each of={calculadoras} render={(calculadora) => {
        return (
          <TarjetaCalculadora {...calculadora} />
        )
      }} />
    </div>
  </>)
}