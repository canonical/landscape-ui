import { z } from "zod";

export const repositoryProfileSchema = z.object({
  all_computers: z.boolean(),
  description: z.date(),
  id: z.number(),
  name: z.string(),
  tags: z.array(z.string()),
});

export type RepositoryProfile = z.infer<typeof repositoryProfileSchema>;
