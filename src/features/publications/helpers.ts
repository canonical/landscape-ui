import type { Publication } from "./types";

export const getSourceType = (source: string) => {
  if (source.startsWith("mirrors/")) {
    return "Mirror";
  }

  if (source.startsWith("locals/")) {
    return "Local repository";
  }

  return "Unknown";
};

export const getPublicationName = (publication: Publication) => {
  const parts = publication.source.split("/");
  return parts.length > 1 ? parts[1] : publication.source;
};

export const getSourceName = (source: string) => {
  const parts = source.split("/");
  return parts.length > 1 ? parts[1] : source;
};

export const getPublicationTargetName = (publicationTarget: string) => {
  const parts = publicationTarget.split("/");
  return parts.length > 1 ? parts[1] : publicationTarget;
};
