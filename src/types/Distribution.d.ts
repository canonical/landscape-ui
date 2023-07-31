import { Series } from "./Series";

export interface Distribution {
  access_group: string;
  name: string;
  creation_time: string;
  series: Series[];
}
