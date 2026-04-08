import type { CreateSeriesParams } from "../../types";

export interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "ubuntu-snapshot" | "third-party";
  pockets: string[];
  components: string[];
  architectures: string[];
  hasPockets: boolean;
  snapshotDate: string;
}
