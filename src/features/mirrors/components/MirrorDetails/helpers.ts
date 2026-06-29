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
    try {
      // Handle legacy values missing a scheme (e.g. "archive.ubuntu.com/ubuntu").
      ({ hostname } = new URL(`https://${archiveRoot}`));
    } catch {
      hostname = undefined;
    }
  }

  // When the archive root parses as a URL, classify strictly by hostname so a
  // third-party mirror whose path merely contains an Ubuntu host is not
  // misclassified.
  if (hostname) {
    return sourceTypeFromHostname(hostname);
  }

  // Legacy values were validated to ensure only URL values, so if hostname
  // extraction failed, treat as third-party.
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
  if (mirror.gpgKey) {
    return true;
  }

  return getSourceType(mirror) === MIRROR_TYPE_LABELS.THIRD_PARTY;
}

// Strip any embedded credentials (e.g. the Ubuntu Pro bearer token in
// `https://bearer:<token>@…`) so they are never shown when displaying an
// archive root. Parses via the URL API and clears the userinfo; the URL is
// otherwise returned in its normalized form. Returns the input unchanged if
// it can't be parsed as an absolute URL.
export function getStrippedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return url;
  }
}
