import { z } from "zod";
import { seriesSchema } from "./Series";

export const distributionSchema = z.object({
  creation_time: z.date(),
  name: z.string(),
  series: z.array(seriesSchema),
});

export type Distribution = z.infer<typeof distributionSchema>;
