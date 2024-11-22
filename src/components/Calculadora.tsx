"use client"
import { Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { evaluate } from "mathjs";
import { useCallback, useEffect, useState } from "react";
import ListaParametros from "./ListaParametros";

interface IParametro extends TypeParametroSchema {
  unidadActual?: Unidad;
}
interface CalculadoraProps {
  formula: string;
  parametros: IParametro[];
}

const Calculadora = ({ formula, parametros }: CalculadoraProps) => {
  const [valores, setValores] = useState({});
  const [resultado, setResultado] = useState(null);

  const [error, setError] = useState(false);

  const handleInputChange = useCallback((parametro: string, valor: number) => {
    setValores((prev) => ({ ...prev, [parametro]: valor }));
  }, []);

  const calcularResultado = useCallback(() => {
    try {
      const result = evaluate(formula, valores);
      setError(false);
      setResultado(result);
    } catch (error) {
      // console.error("Error en la evaluación de la fórmula:", error);
      setError(true);
    }
  }, [formula, valores]);

  useEffect(() => {
    calcularResultado();
  }, [valores]);

  return (<>
    <ListaParametros parametros={parametros} sesion="cliente" onChange={handleInputChange} />
    {/* <Button type="button" variant="default" onClick={calcularResultado}>Calcular</Button> */}

    <div className="flex flex-row gap-4 w-full bg-slate-50 rounded p-8 py-4 ">
      <p className="text-lg">Resultado:</p>
      <p className="text-lg font-bold">{!Number.isNaN(resultado) ? resultado : ''}</p>
    </div>
  </>)
}

export default Calculadora;