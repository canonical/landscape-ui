import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";

export function getSourceType(archiveRoot: string): string {
  switch (new URL(archiveRoot).host) {
    case UBUNTU_ARCHIVE_HOST:
      return "Ubuntu archive";
    case UBUNTU_SNAPSHOTS_HOST:
      return "Ubuntu snapshots";
    case UBUNTU_PRO_HOST:
      return "Ubuntu Pro";
    default:
      return "Third party";
  }
}
