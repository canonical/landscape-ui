import * as Yup from "yup";
import type { FormProps } from "./types";

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
    .required(REQUIRED_FIELD_MESSAGE)
    .test({
      name: "has-architectures",
      message: REQUIRED_FIELD_MESSAGE,
      test: (value) => getCsvValues(value).length > 0,
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

export const getPublicationPayload = (values: FormProps) => {
  return {
    name: values.name.trim(),
    source_type: values.source_type,
    source: values.source.trim(),
    publication_target: values.publication_target.trim(),
    prefix: values.prefix.trim(),
    uploaders: {
      distribution: values.uploader_distribution.trim(),
      components: getCsvValues(values.uploader_components),
      architectures: getCsvValues(values.uploader_architectures),
    },
    signing: {
      preserve_mirror_signing_key: values.preserve_mirror_signing_key,
      mirror_signing_key: values.mirror_signing_key.trim() || null,
    },
    settings: {
      hash_indexing: values.hash_indexing,
      automatic_installation: values.automatic_installation,
      automatic_upgrades: values.automatic_upgrades,
      skip_bz2: values.skip_bz2,
      skip_content_indexing: values.skip_content_indexing,
    },
  };
};
