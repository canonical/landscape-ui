import type { Publication } from "@canonical/landscape-openapi";
import { AUTOMATIC_LABELS } from "./constants";

export const getSourceType = (source: string) => {
  if (source.startsWith("mirrors/")) {
    return "Mirror";
  }

  if (source.startsWith("locals/")) {
    return "Local repository";
  }

  return "Unknown";
};

export const getSourceName = (source: string) => {
  const parts = source.split("/");
  return parts.length > 1 ? (parts[1] ?? source) : source;
};

export const getPublicationTargetName = (publicationTarget: string) => {
  const parts = publicationTarget.split("/");
  return parts.length > 1 ? (parts[1] ?? publicationTarget) : publicationTarget;
};

export const getInstallsAndUpgradesValue = (publication: Publication) => {
  if (!publication.notAutomatic) {
    return AUTOMATIC_LABELS.both;
  }

  if (publication.butAutomaticUpgrades) {
    return AUTOMATIC_LABELS.upgrades;
  }

  return AUTOMATIC_LABELS.neither;
};
