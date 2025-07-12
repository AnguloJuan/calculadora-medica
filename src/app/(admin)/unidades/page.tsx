import { DataTable } from "@/components/data-table";
import { UnidadColumn, unidadColumns } from "@/components/unidades/columns";
import CrearUnidad from "@/components/unidades/CrearUnidad";
import { conectarBd } from "@/db/conectarDb";
import { Unidad } from "@/utils/types";
import { RowDataPacket } from "mysql2";

export default async function UnidadesPage() {
  const conexion = await conectarBd()
  async function obtenerUnidades() {
    interface Unidades extends RowDataPacket, Unidad { }
    try {
      const [unidadRows] = await conexion.query<Unidades[]>('SELECT * FROM unidad');
      return unidadRows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const unidades = await obtenerUnidades();

  const data: UnidadColumn[] = unidades.map((unidad: Unidad) => {
    return {
      id: unidad.id,
      nombre: unidad.unidad,
      id_unidad_conversion: unidad.id_unidad_conversion,
      conversion: unidad.conversion,
      unidad: unidad,
    }
  })

  return (<>
    <div className="bg-background dark:bg-container shadow">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Unidades</h1>
      </div>
    </div>
    <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8 contain-inline-size">
      <div className="bg-background dark:bg-container shadow sm:rounded-lg px-4 py-5 sm:px-6 space-y-4">
        <h3 className="text-lg font-medium leading-6">Unidades</h3>
        <CrearUnidad />
        <DataTable
          columns={unidadColumns}
          data={data}
          filter="categoria"
          columnsClassname="last:sticky last:right-0 last:bg-gradient-to-r from-transparent to-background dark:to-container last:to-[12px] last:pl-4 sm:last:static sm:last:p-2 sm:last:bg-none"
        />
      </div>
    </main>
  </>)
}
