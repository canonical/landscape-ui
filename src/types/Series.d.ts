import { Pocket } from "./Pocket";

export interface Series {
  name: string;
  creation_time: string;
  pockets: Pocket[];
}
