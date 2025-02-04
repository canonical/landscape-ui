import { assertNever } from "@/utils/debug";
import * as Yup from "yup";
import { MIN_SELECTION_COUNT } from "../../constants";
import type {
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
  Pocket,
} from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { FormProps } from "./types";

export const getValidationSchema = (
  mode: "mirror" | "pull" | "upload",
): Yup.Schema => {
  return Yup.object().shape({
    name: Yup.string().required("This field is required"),
    distribution: Yup.string().required("This field is required"),
    series: Yup.string().required("This field is required"),
    components: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(MIN_SELECTION_COUNT, "Please choose at least one component")
      .test({
        name: "flat-mirror-sub-directory",
        message: "A single component must be passed",
        params: { mode },
        test: (value, context) => {
          const { mirror_suite } = context.parent;

          if ("mirror" === mode && /\/$/.test(mirror_suite)) {
            return MIN_SELECTION_COUNT === value.length;
          }

          return true;
        },
      }),
    architectures: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(MIN_SELECTION_COUNT, "Please choose at least one architecture"),
    gpg_key: Yup.string(),
    include_udeb: Yup.boolean(),
    mirror_uri: Yup.string(),
    mirror_suite: Yup.string(),
    mirror_gpg_key: Yup.string(),
    upload_allow_unsigned: Yup.boolean(),
    filters: Yup.array().of(Yup.string()),
    upload_gpg_keys: Yup.array().of(Yup.string()),
  });
};

export const getInitialValues = (
  distributionName: string,
  seriesName: string,
  pocket: Pocket,
): FormProps => {
  const baseValues: FormProps = {
    ...INITIAL_VALUES,
    distribution: distributionName,
    series: seriesName,
    name: pocket.name,
    components: pocket.components,
    architectures: pocket.architectures,
    gpg_key: pocket.gpg_key?.name ?? "",
    include_udeb: pocket.include_udeb,
  };

  switch (pocket.mode) {
    case "mirror":
      return {
        ...baseValues,
        mirror_uri: pocket.mirror_uri,
        mirror_suite: pocket.mirror_suite,
        mirror_gpg_key: pocket.mirror_gpg_key?.name ?? "",
      };
    case "upload":
      return {
        ...baseValues,
        upload_allow_unsigned: pocket.upload_allow_unsigned,
        upload_gpg_keys: pocket.upload_gpg_keys.map(({ name }) => name),
      };
    default:
      return {
        ...baseValues,
        filters: pocket.filters,
      };
  }
};

export const getEditPocketParams = (
  values: FormProps,
  mode: Pocket["mode"],
): EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams => {
  switch (mode) {
    case "mirror":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        mirror_uri: values.mirror_uri,
        mirror_suite: values.mirror_suite,
        mirror_gpg_key: values.mirror_gpg_key,
      };
    case "upload":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        upload_allow_unsigned: values.upload_allow_unsigned,
      };
    case "pull":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
      };
    default:
      return assertNever(mode, "pocket mode");
  }
};
