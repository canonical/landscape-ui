import { GPGKey, UploadedGPGKey } from "@/features/gpg-keys";

export interface PocketCommonProps {
  apt_source_line: string;
  architectures: string[];
  components: string[];
  creation_time: string;
  distribution: {
    access_group: string;
    creation_time: string;
    name: string;
  };
  gpg_key: GPGKey;
  id: number;
  include_udeb: boolean;
  name: string;
  package_count: number;
  series: {
    creation_time: string;
    name: string;
  };
}

export type PocketLastSyncProps =
  | {
      last_sync_activity: {
        id: number;
        pocket_id: number;
        pocket_name: string;
        progress: number;
        result_text: string;
        summary: string;
        type: string;
      };
      last_sync_status:
        | "in progress"
        | "queued"
        | "canceled"
        | "synced"
        | "failed";
      last_sync_status_message: string;
      last_sync_time: string | null;
    }
  | {
      last_sync_activity: null;
      last_sync_status: null;
      last_sync_status_message: null;
      last_sync_time: null;
    };

export interface PocketMirrorProps {
  mirror_suite: string;
  mirror_uri: string;
  mode: "mirror";
  mirror_gpg_key?: GPGKey;
}

export interface PocketPullProps {
  filter_type: "whitelist" | "blacklist" | null;
  filters: string[];
  mode: "pull";
  pull_pocket: string;
}

export interface PocketUploadProps {
  mode: "upload";
  upload_allow_unsigned: boolean;
  upload_gpg_keys: UploadedGPGKey[];
}

type MirrorPocket = PocketMirrorProps & PocketLastSyncProps & PocketCommonProps;

type PullPocket = PocketPullProps & PocketLastSyncProps & PocketCommonProps;

export type UploadPocket = PocketUploadProps & PocketCommonProps;

export type Pocket = MirrorPocket | PullPocket | UploadPocket;
