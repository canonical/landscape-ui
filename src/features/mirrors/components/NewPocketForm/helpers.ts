import { assertNever } from "@/utils/debug";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import * as Yup from "yup";
import { MIN_SELECTION_COUNT } from "../../constants";
import type {
  CreateMirrorPocketParams,
  CreatePullPocketParams,
  CreateUploadPocketParams,
  Series,
} from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { FormProps } from "./types";

export const getCreatePocketParams = (
  values: FormProps,
):
  | CreateMirrorPocketParams
  | CreatePullPocketParams
  | CreateUploadPocketParams => {
  switch (values.mode) {
    case "mirror":
      return {
        mode: values.mode,
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        architectures: values.architectures,
        components: values.components,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        mirror_uri: values.mirror_uri,
        mirror_suite: values.mirror_suite,
        mirror_gpg_key: values.mirror_gpg_key,
      };
    case "upload":
      return {
        mode: values.mode,
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        architectures: values.architectures,
        components: values.components,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        upload_allow_unsigned: values.upload_allow_unsigned,
      };
    case "pull":
      return {
        mode: values.mode,
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        architectures: values.architectures,
        components: values.components,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        pull_series: values.pull_series,
        pull_pocket: values.pull_pocket,
        filter_type: "" !== values.filter_type ? values.filter_type : undefined,
        filter_packages: values.filter_packages,
      };
    default:
      return assertNever(values.mode, "pocket mode");
  }
};

export const getValidationSchema = (series: Series): Yup.Schema =>
  Yup.object().shape({
    type: Yup.string<FormProps["type"]>().required("This field is required."),
    name: Yup.string()
      .required("This field is required")
      .test({
        test: testLowercaseAlphaNumeric.test,
        message: testLowercaseAlphaNumeric.message,
      })
      .test({
        params: { series },
        test: (value) => {
          return !series.pockets.map(({ name }) => name).includes(value);
        },
        message: "It must be unique within series.",
      }),
    distribution: Yup.string().required("This field is required"),
    series: Yup.string().required("This field is required"),
    components: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(MIN_SELECTION_COUNT, "Please choose at least one component")
      .test({
        name: "flat-mirror-sub-directory",
        message: "A single component must be passed",
        test: (value, context) => {
          const { mode, mirror_suite } = context.parent;

          if ("mirror" === mode && mirror_suite.endsWith("/")) {
            return MIN_SELECTION_COUNT === value.length;
          }

          return true;
        },
      })
      .required("This field is required"),
    architectures: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(MIN_SELECTION_COUNT, "Please choose at least one architecture"),
    mode: Yup.string<FormProps["mode"]>().required("This field is required"),
    gpg_key: Yup.string().required("This field is required"),
    include_udeb: Yup.boolean().required("This field is required"),
    mirror_uri: Yup.string().when("mode", {
      is: "mirror",
      then: (schema) => schema.required("This field is required"),
    }),
    mirror_suite: Yup.string(),
    mirror_gpg_key: Yup.string(),
    pull_pocket: Yup.string().when("mode", {
      is: "pull",
      then: (schema) => schema.required("This field is required"),
    }),
    pull_series: Yup.string(),
    filter_type: Yup.string<"blacklist" | "whitelist">(),
    filter_packages: Yup.array().of(Yup.string().defined()),
    upload_allow_unsigned: Yup.boolean(),
    upload_gpg_keys: Yup.array().of(Yup.string().defined()),
  });

export const getInitialValues = (
  distributionName: string,
  seriesName: string,
): FormProps => {
  return {
    ...INITIAL_VALUES,
    distribution: distributionName,
    series: seriesName,
  };
};
