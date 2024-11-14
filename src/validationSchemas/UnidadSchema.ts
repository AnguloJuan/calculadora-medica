import { Unidad } from "@/utils/types";
import { z } from "../lib/es-zod";

const UnidadSchema = z.object({
  id: z.number(),
  unidad: z.string().min(1).max(10),
  conversion: z.number().optional(),
  id_unidad_conversion: z.number().optional()
}) satisfies z.ZodType<Unidad>;

export default UnidadSchema;
