import type { Mirror } from "@canonical/landscape-openapi";

const MIRROR_TYPE_LABELS: Record<NonNullable<Mirror["mirrorType"]>, string> = {
  MIRROR_TYPE_UNSPECIFIED: "Third party",
  UBUNTU_ARCHIVE: "Ubuntu archive",
  UBUNTU_SNAPSHOTS: "Ubuntu snapshots",
  UBUNTU_PRO: "Ubuntu Pro",
  THIRD_PARTY: "Third party",
};

export function getSourceType(mirrorType: Mirror["mirrorType"]): string {
  return mirrorType ? MIRROR_TYPE_LABELS[mirrorType] : "Third party";
}

// Legacy mirrors created before mirrorType existed report it as undefined or
// MIRROR_TYPE_UNSPECIFIED, so fall back to the presence of a GPG key to keep
// their authentication details visible.
export function shouldShowAuthentication(mirror: Mirror): boolean {
  return mirror.mirrorType === "THIRD_PARTY" || !!mirror.gpgKey;
}
