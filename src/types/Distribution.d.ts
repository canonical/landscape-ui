import { Series } from "./Series";

export interface Distribution {
  access_group: string;
  creation_time: string;
  name: string;
  series: Series[];
}
