import type {
  CreateMirrorPocketParams,
  CreatePullPocketParams,
  CreateUploadPocketParams,
} from "../../types";

interface FormProps
  extends
    Omit<CreateMirrorPocketParams, "mode">,
    Omit<CreatePullPocketParams, "mode" | "filter_type">,
    Omit<CreateUploadPocketParams, "mode"> {
  type: "ubuntu" | "third-party";
  mode:
    | CreateMirrorPocketParams["mode"]
    | CreatePullPocketParams["mode"]
    | CreateUploadPocketParams["mode"];
  pull_series: string;
  filter_type: CreatePullPocketParams["filter_type"] | "";
  filter_packages: string[];
  upload_gpg_keys: string[];
}
