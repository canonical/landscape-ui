import type { Mirror } from "@canonical/landscape-openapi";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";

const MIRROR_TYPE_LABELS: Record<NonNullable<Mirror["mirrorType"]>, string> = {
  MIRROR_TYPE_UNSPECIFIED: "Third party",
  UBUNTU_ARCHIVE: "Ubuntu archive",
  UBUNTU_SNAPSHOTS: "Ubuntu snapshots",
  UBUNTU_PRO: "Ubuntu Pro",
  THIRD_PARTY: "Third party",
};

// Legacy mirrors created before mirrorType existed report it as undefined or
// MIRROR_TYPE_UNSPECIFIED, so infer the type from the archive host to avoid
// mislabeling Ubuntu mirrors as "Third party".
function inferSourceTypeFromUrl(archiveRoot: string | undefined): string {
  if (archiveRoot?.includes(UBUNTU_SNAPSHOTS_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_SNAPSHOTS;
  }

  if (archiveRoot?.includes(UBUNTU_PRO_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_PRO;
  }

  if (archiveRoot?.includes(UBUNTU_ARCHIVE_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_ARCHIVE;
  }

  return MIRROR_TYPE_LABELS.THIRD_PARTY;
}

export function getSourceType(
  mirror: Pick<Mirror, "mirrorType" | "archiveRoot">,
): string {
  if (mirror.mirrorType && mirror.mirrorType !== "MIRROR_TYPE_UNSPECIFIED") {
    return MIRROR_TYPE_LABELS[mirror.mirrorType];
  }

  return inferSourceTypeFromUrl(mirror.archiveRoot);
}

// Show the Authentication section for third-party mirrors so users can add or
// view a verification GPG key. Legacy mirrors created before mirrorType existed
// report it as undefined or MIRROR_TYPE_UNSPECIFIED, so reuse getSourceType's
// URL-based inference, and always show it when a GPG key already exists.
export function shouldShowAuthentication(mirror: Mirror): boolean {
  return (
    getSourceType(mirror) === MIRROR_TYPE_LABELS.THIRD_PARTY || !!mirror.gpgKey
  );
}
