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

const UBUNTU_SECURITY_HOST = "security.ubuntu.com";

// Match an exact Ubuntu host or any of its subdomains (e.g. regional mirrors
// like us.archive.ubuntu.com) without matching unrelated hosts that merely
// contain the host as a substring.
function matchesHost(hostname: string, host: string): boolean {
  return hostname === host || hostname.endsWith(`.${host}`);
}

function sourceTypeFromHostname(hostname: string): string {
  if (matchesHost(hostname, UBUNTU_SNAPSHOTS_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_SNAPSHOTS;
  }

  if (matchesHost(hostname, UBUNTU_PRO_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_PRO;
  }

  if (
    matchesHost(hostname, UBUNTU_ARCHIVE_HOST) ||
    matchesHost(hostname, UBUNTU_SECURITY_HOST)
  ) {
    return MIRROR_TYPE_LABELS.UBUNTU_ARCHIVE;
  }

  return MIRROR_TYPE_LABELS.THIRD_PARTY;
}

// Legacy mirrors created before mirrorType existed report it as undefined or
// MIRROR_TYPE_UNSPECIFIED, so infer the type from the archive host to avoid
// mislabeling Ubuntu mirrors as "Third party".
function inferSourceTypeFromUrl(archiveRoot?: string): string {
  if (!archiveRoot) {
    return MIRROR_TYPE_LABELS.THIRD_PARTY;
  }

  let hostname: string | undefined;
  try {
    ({ hostname } = new URL(archiveRoot));
  } catch {
    hostname = undefined;
  }

  // When the archive root parses as a URL, classify strictly by hostname so a
  // third-party mirror whose path merely contains an Ubuntu host is not
  // misclassified.
  if (hostname) {
    return sourceTypeFromHostname(hostname);
  }

  // The substring fallback only applies to truly non-URL legacy values.
  if (archiveRoot.includes(UBUNTU_SNAPSHOTS_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_SNAPSHOTS;
  }

  if (archiveRoot.includes(UBUNTU_PRO_HOST)) {
    return MIRROR_TYPE_LABELS.UBUNTU_PRO;
  }

  if (
    archiveRoot.includes(UBUNTU_ARCHIVE_HOST) ||
    archiveRoot.includes(UBUNTU_SECURITY_HOST)
  ) {
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
