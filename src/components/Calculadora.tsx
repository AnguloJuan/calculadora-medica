"use client"
import { z } from "@/lib/es-zod";
import { ParametroSchema } from "@/validationSchemas/ParametroSchema";
import { evaluate } from "mathjs";
import { useCallback, useState } from "react";
import ListaParametros from "./ListaParametros";
import { Button } from "./ui/button";

interface CalculadoraProps {
  formula: string;
  parametros: z.infer<typeof ParametroSchema>[];
}

const Calculadora = ({ formula, parametros }: CalculadoraProps) => {
  const [inputs, setInputs] = useState({});
  const [resultado, setResultado] = useState(null);

  const [error, setError] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) }));
  }, []);

  const calcularResultado = useCallback(() => {
    try {
      const result = evaluate(formula, inputs);
      setError(false);
      setResultado(result);
    } catch (error) {
      console.error("Error en la evaluación de la fórmula:", error);
      setError(true);
    }
  }, [formula, inputs]);

  return (<>
    <ListaParametros parametros={parametros} sesion="cliente" />
    <Button type="button" variant="default" onClick={calcularResultado}>Calcular</Button>

    <div className="flex flex-row gap-4 w-full bg-slate-50 rounded p-8 py-4 ">
      <p className="text-lg">Resultado:</p>
      <p className="text-lg font-bold" ref={resultado}>{resultado}</p>
    </div>
  </>)
}

export default Calculadora;