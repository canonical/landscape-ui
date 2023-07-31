import { Pocket } from "./Pocket";
import { Distribution } from "./Distribution";
import { Series } from "./Series";

type RepositoryProfilePocket = Pocket & {
  distribution: Pick<Distribution, "access_group" | "creation_time" | "name">;
  series: Pick<Series, "name" | "creation_time">;
};

export interface RepositoryProfile {
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
