import { Pocket } from "./Pocket";
import { AptSource } from "./AptSource";

export interface RepositoryProfile {
  access_group: string;
  all_computers: boolean;
  apt_sources: AptSource[];
  description: string;
  id: number;
  name: string;
  pending_count: number;
  pockets: Pocket[];
  tags: string[];
  title: string;
}
