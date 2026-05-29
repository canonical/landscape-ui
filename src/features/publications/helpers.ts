import type { Publication } from "@canonical/landscape-openapi";
import { AUTOMATIC_LABELS } from "./constants";
import type { PublishNewFormValues } from "./types";

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

export const getInitialValues = (publicationTarget = ""): PublishNewFormValues => {
  return {
    name: "",
    publicationTarget,
    signingKey: "",
    hashIndexing: false,
    installsAndUpgrades: "automatic",
    skipBz2: false,
    skipContentIndexing: false,
  };
};

export const getInstallsAndUpgradesText = (publication: Publication) => {
  if (!publication.notAutomatic) {
    return AUTOMATIC_LABELS.automatic;
  }

  if (publication.butAutomaticUpgrades) {
    return AUTOMATIC_LABELS.autoUpgrades;
  }

  return AUTOMATIC_LABELS.manual;
};

export const getInstallsAndUpgradesValues = (
  installsAndUpgrades: PublishNewFormValues["installsAndUpgrades"]
) => {
  switch (installsAndUpgrades) {
    case "automatic":
      return {
        notAutomatic: false,
        butAutomaticUpgrades: false,
      };
    case "manual":
      return {
        notAutomatic: true,
        butAutomaticUpgrades: false,
      };
    case "autoUpgrades":
      return {
        notAutomatic: true,
        butAutomaticUpgrades: true,
      };
  }
};
