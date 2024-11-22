import { z } from "../lib/es-zod";

const EvidenciaSchema = z.object({
  cita: z.string(),
  enlace: z.string(),
})

export default EvidenciaSchema;
