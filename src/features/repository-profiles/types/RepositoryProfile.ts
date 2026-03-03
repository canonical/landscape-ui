import type { Distribution, Pocket, Series } from "@/features/mirrors";
import type { Profile } from "@/features/profiles";

export type RepositoryProfilePocket = Pocket & {
  distribution: Pick<Distribution, "access_group" | "creation_time" | "name">;
  series: Pick<Series, "name" | "creation_time">;
};

export interface RepositoryProfile extends Profile {
  apt_sources: number[];
  pending_count: number;
  pockets: RepositoryProfilePocket[];
}
