import type { Distribution, UbuntuArchiveInfo } from "./types";

export function isDistributionValid(distribution: Distribution): boolean {
  return (
    distribution.architectures.length > 0 && distribution.components.length > 0
  );
}

export function isArchiveInfoValid(archiveInfo: UbuntuArchiveInfo): boolean {
  return archiveInfo.distributions.some(isDistributionValid);
}
