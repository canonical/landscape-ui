import type { Distribution } from "./Distribution";

export interface UbuntuArchiveInfo {
  label: string;
  mirror_type: string;
  mirror_url: string;
  distributions: Distribution[];
}
