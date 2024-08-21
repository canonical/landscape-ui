import { CreateSeriesParams } from "@/hooks/useSeries";

export interface FormProps extends Required<CreateSeriesParams> {
  architectures: string[];
  components: string[];
  pockets: string[];
  snapshotDate: string;
  token: string;
  type: "ubuntu" | "ubuntu-pro" | "ubuntu-snapshot" | "third-party";
}
