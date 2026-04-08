import type {
  PocketCommonProps,
  PocketLastSyncProps,
  PocketMirrorProps,
  PocketPullProps,
  PocketUploadProps,
} from "../../types";

// Flatten the discriminated union into a single optional-property object so
// that CommonPocket remains a plain object type (not a union), which is
// required for react-table's Column<D> generic constraint.
type PartialLastSyncProps = {
  [K in keyof PocketLastSyncProps]?: PocketLastSyncProps[K];
};

export type CommonPocket = Record<string, unknown> &
  PocketCommonProps &
  PartialLastSyncProps &
  Partial<Omit<PocketMirrorProps, "mode">> &
  Partial<Omit<PocketPullProps, "mode">> &
  Partial<Omit<PocketUploadProps, "mode">> & {
    mode:
      | PocketMirrorProps["mode"]
      | PocketPullProps["mode"]
      | PocketUploadProps["mode"];
  };
