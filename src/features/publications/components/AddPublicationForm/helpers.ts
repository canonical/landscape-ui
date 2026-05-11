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
  source_type: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publication_target: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  prefix: Yup.string(),
  uploader_distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  uploader_architectures: Yup.array()
    .of(Yup.string())
    .when("source_type", {
      is: SOURCE_TYPE_LOCAL_REPOSITORY,
      then: (schema) => schema,
      otherwise: (schema) => schema.min(1, REQUIRED_FIELD_MESSAGE),
    }),
  signing_key: Yup.string(),
  hash_indexing: Yup.boolean(),
  automatic_installation: Yup.boolean(),
  automatic_upgrades: Yup.boolean(),
  skip_bz2: Yup.boolean(),
  skip_content_indexing: Yup.boolean(),
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
    values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY
      ? "locals/"
      : "mirrors/";
  const architectures =
    values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY
      ? []
      : values.uploader_architectures;

  return {
    publicationId,
    body: {
      displayName: values.name.trim(),
      publicationTarget: prependResourcePrefix(
        values.publication_target,
        "publicationTargets/",
      ),
      source: prependResourcePrefix(values.source, sourcePrefix),
      distribution: values.uploader_distribution.trim() || undefined,
      label: values.prefix.trim() || undefined,
      architectures: architectures.length > 0 ? architectures : undefined,
      acquireByHash: values.hash_indexing,
      notAutomatic: !values.automatic_installation,
      butAutomaticUpgrades: values.automatic_upgrades,
      skipBz2: values.skip_bz2,
      skipContents: values.skip_content_indexing,
      gpgKey: values.signing_key.trim()
        ? { armor: values.signing_key.trim() }
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
