"use client"
import { Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { evaluate } from "mathjs";
import { useCallback, useEffect, useState } from "react";
import ListaParametros from "../parametros/ListaParametros";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";

type IParametro = TypeParametroSchema & {
  unidadActual?: Unidad;
}
interface CalculadoraProps {
  formula: string;
  parametros: IParametro[];
  unidad_resultado?: string;
}

const Calculadora = ({ formula, parametros, unidad_resultado }: CalculadoraProps) => {
  const [valores, setValores] = useState({});
  const [resultado, setResultado] = useState(null);

  const [error, setError] = useState(false);

  const handleInputChange = useCallback((parametro: string, valor: number) => {
    const param = parametro.replace(" ", "");
    setValores((prev) => ({ ...prev, [param]: valor }));
  }, []);

  const calcularResultado = useCallback(() => {
    try {
      const result = evaluate(formula, valores);
      setError(false);
      // formatear el resultado a 6 decimales
      setResultado(result.toFixed(6));
    } catch (error) {
      // console.error("Error en la evaluación de la fórmula:", error);
      setError(true);
    }
  }, [formula, valores]);

  useEffect(() => {
    calcularResultado();
  }, [valores]);

  return (<>
    <Card className="w-[400px] bg-container">
      <CardHeader>
        <CardDescription>Ingrese los datos</CardDescription>
      </CardHeader>
      <CardContent>
        <ListaParametros parametros={parametros} onChange={handleInputChange} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-4 w-full bg-muted rounded p-8 py-4 ">
          <p className="text-lg">Resultado:</p>
          <p className="text-lg font-bold">{!Number.isNaN(resultado) ? resultado : ''} {unidad_resultado && (' ' + unidad_resultado)}</p>
        </div>
      </CardFooter>
    </Card>

  </>)
}

export default Calculadora;