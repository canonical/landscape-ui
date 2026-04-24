import type { Pocket } from "./Pocket";

export interface Series {
  creation_time: string;
  name: string;
  pockets: Pocket[];
}
