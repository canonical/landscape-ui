import type {
  PocketCommonProps,
  PocketLastSyncProps,
  PocketMirrorProps,
  PocketPullProps,
  PocketUploadProps,
} from "../../types";

export interface CommonPocket
  extends Record<string, unknown>,
    PocketCommonProps,
    Partial<PocketLastSyncProps>,
    Partial<Omit<PocketMirrorProps, "mode">>,
    Partial<Omit<PocketPullProps, "mode">>,
    Partial<Omit<PocketUploadProps, "mode">> {
  mode:
    | PocketMirrorProps["mode"]
    | PocketPullProps["mode"]
    | PocketUploadProps["mode"];
}
