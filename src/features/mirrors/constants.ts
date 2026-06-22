import type { MirrorWritable } from "@canonical/landscape-openapi";
import type { FormProps } from "./components/AddMirrorForm/types";

export const UBUNTU_ARCHIVE_HOST = "archive.ubuntu.com";
export const UBUNTU_SNAPSHOTS_HOST = "snapshot.ubuntu.com";
export const UBUNTU_PRO_HOST = "esm.ubuntu.com";

export const SOURCE_TYPE_TO_MIRROR_TYPE: Record<
  FormProps["sourceType"],
  NonNullable<MirrorWritable["mirrorType"]>
> = {
  "ubuntu-archive": "UBUNTU_ARCHIVE",
  "ubuntu-snapshots": "UBUNTU_SNAPSHOTS",
  "ubuntu-pro": "UBUNTU_PRO",
  "third-party": "THIRD_PARTY",
};

export const SETTINGS_HELP_TEXT = {
  preserveSignatures:
    "Signature-preserving mirrors directly copy the packages from the source to their destination without signing or syncing the packages.",
  includeDependencies:
    "Includes dependencies of the packages that match the filter, even if they don't match the filter themselves.",
  downloadUdebPackages:
    "Enables the mirroring of micro-debian (.udeb) packages. These are essential if you intend to use this mirror for network booting (PXE), netboot installations, or hardware discovery during the initial OS installation process.",
};
