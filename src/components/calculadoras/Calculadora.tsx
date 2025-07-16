"use client"
import { Unidad } from "@/utils/types";
import { TypeParametroSchema } from "@/validationSchemas/ParametroSchema";
import { evaluate } from "mathjs";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Each } from "../EachOf";
import CampoParametro from "../parametros/CampoParametro";

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
      setResultado(result.toFixed(6));
    } catch (error) {
      setError(true);
    }
  }, [formula, valores]);

  useEffect(() => {
    calcularResultado();
  }, [valores]);

  return (<>
    <Card className="bg-container">
      <CardHeader>
        <CardDescription>Ingrese los datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full gap-6">
          <Each
            of={parametros}
            render={(parametro) => {
              return (<CampoParametro key={parametro.id} parametro={parametro} onChange={handleInputChange} />)
            }}
          />
        </div>
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