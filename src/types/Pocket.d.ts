import { GPGKey, UploadedGPGKey } from "./GPGKey";

interface PocketCommon {
  apt_source_line: string;
  architectures: string[];
  components: string[];
  creation_time: string;
  gpg_key: GPGKey;
  include_udeb: boolean;
  name: string;
  package_count: number;
}

interface MirrorPocket {
  mode: "mirror";
  mirror_suite: string;
  mirror_uri: string;
  mirror_gpg_key?: GPGKey;
  last_sync_activity: {
    pocket_id: number;
    pocket_name: string;
    progress: number;
    result_text: string;
    summary: string;
    type: string;
  } | null;
  last_sync_status: string | null;
  last_sync_status_message: string | null;
  last_sync_time: string | null;
}

interface PullPocket {
  mode: "pull";
  filter_type: "whitelist" | "blacklist" | null;
  filters: string[];
  pull_pocket: string;
  last_sync_activity: {
    pocket_id: number;
    pocket_name: string;
    progress: number;
    result_text: string;
    summary: string;
    type: string;
  } | null;
  last_sync_status: string | null;
  last_sync_status_message: string | null;
  last_sync_time: string | null;
}

interface UploadPocket {
  mode: "upload";
  upload_allow_unsigned: boolean;
  upload_gpg_keys: UploadedGPGKey[];
}

type PocketByMode = MirrorPocket | PullPocket | UploadPocket;

export type Pocket = PocketByMode & PocketCommon;
