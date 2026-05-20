import * as Yup from "yup";
import type { FormProps } from "./types";
import type { PublicationWritable } from "@canonical/landscape-openapi";
import { SOURCE_TYPE_LOCAL_REPOSITORY } from "./constants";

export interface CreatePublicationPayload {
  publicationId?: string;
  body: PublicationWritable;
}

const REQUIRED_FIELD_MESSAGE = "This field is required";

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  sourceType: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publicationTarget: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  prefix: Yup.string(),
  uploaderDistribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  uploaderArchitectures: Yup.array()
    .of(Yup.string())
    .when("sourceType", {
      is: SOURCE_TYPE_LOCAL_REPOSITORY,
      then: (schema) => schema,
      otherwise: (schema) => schema.min(1, REQUIRED_FIELD_MESSAGE),
    }),
  signingKey: Yup.string(),
  hashIndexing: Yup.boolean(),
  limitAutomaticInstallation: Yup.boolean(),
  automaticUpgrades: Yup.boolean(),
  skipBz2: Yup.boolean(),
  skipContentIndexing: Yup.boolean(),
});

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
      : values.uploaderArchitectures;

  return {
    publicationId,
    body: {
      displayName: values.name.trim(),
      publicationTarget: prependResourcePrefix(
        values.publicationTarget,
        "publicationTargets/",
      ),
      source: prependResourcePrefix(values.source, sourcePrefix),
      distribution: values.uploaderDistribution.trim() || undefined,
      label: values.prefix.trim() || undefined,
      architectures: architectures.length > 0 ? architectures : undefined,
      acquireByHash: values.hashIndexing,
      notAutomatic: values.limitAutomaticInstallation,
      butAutomaticUpgrades: values.automaticUpgrades,
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
