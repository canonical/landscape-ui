import * as Yup from "yup";
import type { FormProps } from "./types";
import type { PublicationWritable } from "../../types";
import {
  LOCAL_ARCHITECTURES_PLACEHOLDER,
  SOURCE_TYPE_LOCAL_REPOSITORY,
} from "./constants";

export interface CreatePublicationPayload {
  publicationId?: string;
  body: PublicationWritable;
}

const REQUIRED_FIELD_MESSAGE = "This field is required";

export const getCsvValues = (value?: string): string[] => {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source_type: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  publication_target: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  prefix: Yup.string(),
  uploader_distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  uploader_components: Yup.string()
    .required(REQUIRED_FIELD_MESSAGE)
    .test({
      name: "has-components",
      message: REQUIRED_FIELD_MESSAGE,
      test: (value) => getCsvValues(value).length > 0,
    }),
  uploader_architectures: Yup.string()
    .when("source_type", {
      is: SOURCE_TYPE_LOCAL_REPOSITORY,
      then: (schema) => schema,
      otherwise: (schema) => schema.required(REQUIRED_FIELD_MESSAGE),
    })
    .test({
      name: "has-architectures",
      message: REQUIRED_FIELD_MESSAGE,
      test: (value, context) => {
        if (context.parent.source_type === SOURCE_TYPE_LOCAL_REPOSITORY) {
          return true;
        }

        return getCsvValues(value).length > 0;
      },
    }),
  preserve_mirror_signing_key: Yup.boolean(),
  mirror_signing_key: Yup.string().when("preserve_mirror_signing_key", {
    is: false,
    then: (schema) => schema.required(REQUIRED_FIELD_MESSAGE),
    otherwise: (schema) => schema,
  }),
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
  const components = getCsvValues(values.uploader_components);
  const architectures =
    values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY &&
    values.uploader_architectures === LOCAL_ARCHITECTURES_PLACEHOLDER
      ? []
      : getCsvValues(values.uploader_architectures);

  return {
    publicationId,
    body: {
      publicationTarget: prependResourcePrefix(
        values.publication_target,
        "publicationTargets/",
      ),
      mirror: prependResourcePrefix(values.source, "mirrors/"),
      distribution: values.uploader_distribution.trim() || undefined,
      component: components[0],
      label: values.prefix.trim() || undefined,
      architectures: architectures.length > 0 ? architectures : undefined,
      acquireByHash: values.hash_indexing,
      notAutomatic: !values.automatic_installation,
      butAutomaticUpgrades: values.automatic_upgrades,
      skipBz2: values.skip_bz2,
      skipContents: values.skip_content_indexing,
      gpgKey: values.preserve_mirror_signing_key
        ? undefined
        : {
            armor: values.mirror_signing_key.trim(),
          },
    },
  };
};
