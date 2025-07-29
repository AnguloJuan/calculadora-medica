import { Calculadora, Evidencia } from "@/utils/types";
import { FileText } from "lucide-react";
import { Each } from "../EachOf";
import ReadOnlyRichText from "../slatejs/read-only";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CalculadoraInfoProps {
  calculadora: Calculadora
  evidencias: Evidencia[]
}

export default function CalculadoraInfo({ calculadora, evidencias }: CalculadoraInfoProps) {
  return (
    <Tabs defaultValue="Formula" className="w-full">
      <TabsList className="grid w-full grid-cols-3 rounded-t-none">
        <TabsTrigger value="Formula" className="text-xs sm:text-sm">Formula</TabsTrigger>
        <TabsTrigger value="Recomendaciones" className="text-xs sm:text-sm">Recomendaciones</TabsTrigger>
        <TabsTrigger value="Evidencias" className="text-xs sm:text-sm">Evidencias</TabsTrigger>
      </TabsList>

      <TabsContent value="Formula">
        <Card className="bg-container">
          <CardHeader>
            <CardTitle>Formula</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{calculadora.formula_display ? calculadora.formula_display : calculadora.formula}</p>
          </CardContent>
          <CardHeader>
            <CardTitle>Acerca de {calculadora.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadOnlyRichText value={calculadora.descripcion} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="Recomendaciones">
        <Card className="bg-container">
          <CardHeader>
            <CardTitle>Resultados y Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadOnlyRichText value={calculadora.resultados_recomendaciones} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="Evidencias">
        <Card className="bg-container">
          <CardHeader>
            <CardTitle>Evidencias</CardTitle>
          </CardHeader>
          <CardContent>
            <Each of={evidencias} render={
              (evidencia, index) => (<>
                {evidencia.enlace ?
                  <a href={evidencia.enlace} target="_blank">
                    <Card key={index} className="w-full py-4 ps-4 pe-0">
                      <CardContent className="p-0 flex flex-row gap-2">
                        <FileText className="min-w-6 min-h-6" />
                        <p className="text-sm text-muted-foreground">{evidencia.cita}</p>
                      </CardContent>
                    </Card>
                  </a> :
                  <Card key={index} className="w-full py-4 ps-4 pe-0">
                    <CardContent className="p-0 flex flex-row gap-2">
                      <FileText className="min-w-6 min-h-6" />
                      <p className="text-sm text-muted-foreground">{evidencia.cita}</p>
                    </CardContent>
                  </Card>
                }

              </>)
            } />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}