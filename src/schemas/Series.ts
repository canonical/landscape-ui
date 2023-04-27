import { z } from "zod";
import { pocketSchema } from "./Pocket";

export const seriesSchema = z.object({
  creation_time: z.date(),
  name: z.string(),
  pockets: z.array(pocketSchema),
});

export type Series = z.infer<typeof seriesSchema>;
