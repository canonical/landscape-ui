import type { Pocket } from "./Pocket";

export interface Series {
  creation_time: string;
  name: string;
  pockets: Pocket[];
}

export interface Repo {
  architectures: string;
  codename: string;
  description: string;
  label: string;
  origin: string;
  repo: string;
  url: string;
  version: string;
}

export interface RepoInfo {
  flat: boolean;
  repos: Repo[];
  ubuntu: boolean;
}
