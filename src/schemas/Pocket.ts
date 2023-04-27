import { z } from "zod";

export const pocketSchema = z.object({
  creation_time: z.date(),
  name: z.string(),
  architectures: z.array(z.string()),
  components: z.array(z.string()),
  mirror_suite: z.string(),
  mirror_uri: z.string(),
  mode: z.string(),
});

export type Pocket = z.infer<typeof pocketSchema>;
