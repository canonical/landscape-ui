import { Pocket } from "./Pocket";

export interface RepositoryProfile {
  access_group: string;
  all_computers: boolean;
  apt_sources: string[];
  description: string;
  id: number;
  name: string;
  pending_count: number;
  pockets: Pocket[];
  tags: string[];
  title: string;
}
