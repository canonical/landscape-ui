import { Series } from "./Series";

export interface Distribution {
  name: string;
  creation_time: string;
  series: Series[];
}
