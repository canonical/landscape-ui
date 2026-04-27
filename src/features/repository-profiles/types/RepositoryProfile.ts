import type { Distribution, Pocket, Series } from "@/features/mirrors";

type RepositoryProfilePocket = Pocket & {
  distribution: Pick<Distribution, "access_group" | "creation_time" | "name">;
  series: Pick<Series, "name" | "creation_time">;
};

export interface RepositoryProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  apt_sources: number[];
  description: string;
  id: number;
  name: string;
  pending_count: number;
  pockets: RepositoryProfilePocket[];
  tags: string[];
  title: string;
}
