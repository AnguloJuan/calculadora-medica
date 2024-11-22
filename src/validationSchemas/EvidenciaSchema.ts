import { Evidencia } from "@/utils/types";
import { z } from "../lib/es-zod";

const EvidenciaSchema = z.object({
  id: z.number(),
  cita: z.string(),
  enlace: z.string(),
  id_calculadora: z.number()
}) satisfies z.ZodType<Evidencia>;

export default EvidenciaSchema;
