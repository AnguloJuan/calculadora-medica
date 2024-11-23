import { z } from "../lib/es-zod";

const UnidadSchema = z.object({
  id: z.number(),
  unidad: z.string().min(1).max(10),
  conversion: z.number().nullish().optional(),
  id_unidad_conversion: z.number().nullish().optional()
});

export default UnidadSchema;
