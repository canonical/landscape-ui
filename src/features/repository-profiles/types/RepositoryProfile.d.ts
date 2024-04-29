import { Pocket } from "@/types/Pocket";
import { Distribution } from "@/types/Distribution";
import { Series } from "@/types/Series";

type RepositoryProfilePocket = Pocket & {
  distribution: Pick<Distribution, "access_group" | "creation_time" | "name">;
  series: Pick<Series, "name" | "creation_time">;
};

export interface RepositoryProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  apt_sources: string[];
  description: string;
  id: number;
  name: string;
  pending_count: number;
  pockets: RepositoryProfilePocket[];
  tags: string[];
  title: string;
}
