import type { FormProps } from "./types";
import type { PublicationWritable } from "@canonical/landscape-openapi";
import { SOURCE_TYPE_LOCAL_REPOSITORY } from "./constants";
import { getInstallsAndUpgradesValues } from "../../helpers";

export interface CreatePublicationPayload {
  publicationId?: string;
  body: PublicationWritable;
}

export const getPreviewValue = (value?: string): string => {
  return value?.trim() || "-";
};

const prependResourcePrefix = (value: string, prefix: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith(prefix)) {
    return trimmedValue;
  }

  return `${prefix}${trimmedValue}`;
};

export const getPublicationPayload = (values: FormProps) => {
  const publicationId = values.name.trim() || undefined;
  const sourcePrefix =
    values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY ? "locals/" : "mirrors/";
  const architectures =
    values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY
      ? []
      : values.architectures;
  const { notAutomatic, butAutomaticUpgrades } = getInstallsAndUpgradesValues(
    values.installsAndUpgrades,
  );

  return {
    publicationId,
    body: {
      displayName: values.name.trim(),
      publicationTarget: prependResourcePrefix(
        values.publicationTarget,
        "publicationTargets/",
      ),
      source: prependResourcePrefix(values.source, sourcePrefix),
      distribution: values.distribution.trim() || undefined,
      architectures: architectures.length > 0 ? architectures : undefined,
      acquireByHash: values.hashIndexing,
      notAutomatic,
      butAutomaticUpgrades,
      skipBz2: values.skipBz2,
      skipContents: values.skipContentIndexing,
      gpgKey: values.signingKey.trim()
        ? { armor: values.signingKey.trim() }
        : undefined,
    },
  };
};

export const stripResourcePrefix = (value?: string, prefix?: string) => {
  if (!value || !prefix) {
    return value ?? "";
  }

  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
};
