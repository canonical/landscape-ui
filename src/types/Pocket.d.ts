import { GPGKey, UploadedGPGKey } from "./GPGKey";

interface PocketCommon {
  apt_source_line: string;
  architectures: string[];
  components: string[];
  creation_time: string;
  gpg_key: GPGKey;
  include_udeb: boolean;
  name: string;
}

interface MirrorPocket {
  mode: "mirror";
  mirror_suite: string;
  mirror_uri: string;
  mirror_gpg_key?: string;
}

interface PullPocket {
  mode: "pull";
  filter_type: "whitelist" | "blacklist" | null;
  filters: string[];
  pull_pocket: string;
}

interface UploadPocket {
  mode: "upload";
  upload_allow_unsigned: boolean;
  upload_gpg_keys: UploadedGPGKey[];
}

type PocketByMode = MirrorPocket | PullPocket | UploadPocket;

export type Pocket = PocketByMode & PocketCommon;
