import { DISPLAY_DATE_FORMAT } from "@/constants";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import moment from "moment";
import * as Yup from "yup";
import { Distribution } from "../../types";
import { INITIAL_VALUES, SNAPSHOT_START_DATE } from "./constants";
import { FormProps } from "./types";

export const getStrippedUrl = (url: string) => url.replace(/\/[^\\/@]*@/, "/");

export const getInitialValues = (distribution?: Distribution) => {
  return distribution
    ? { ...INITIAL_VALUES, distribution: distribution.name }
    : INITIAL_VALUES;
};

export const getValidationSchema = (
  distributions: Distribution[],
  distribution?: Distribution,
) => {
  return Yup.object().shape({
    distribution: Yup.string().required("This field is required."),
    type: Yup.string<FormProps["type"]>().required("This field is required."),
    name: Yup.string()
      .required("This field is required.")
      .test({
        test: testLowercaseAlphaNumeric.test,
        message: testLowercaseAlphaNumeric.message,
      })
      .test({
        test: (_, context) => {
          return !!context.parent.distribution;
        },
        message: "First select the distribution.",
      })
      .test({
        params: { distribution, distributions },
        test: (value, context) => {
          if (!context.parent.distribution) {
            return true;
          }

          const seriesNames = distribution
            ? distribution.series.map(({ name }) => name)
            : distributions
                .filter(({ name }) => name === context.parent.distribution)[0]
                .series.map(({ name }) => name);

          return !seriesNames.includes(value);
        },
        message: "It must be unique within series within the distribution.",
      }),
    hasPockets: Yup.boolean(),
    mirror_series: Yup.string(),
    mirror_gpg_key: Yup.string(),
    mirror_uri: Yup.string().when("hasPockets", (values, schema) =>
      values[0]
        ? schema.nonNullable().required("This field is required.")
        : schema,
    ),
    snapshotDate: Yup.string().when("type", (values, schema) =>
      values[0] === "ubuntu-snapshot"
        ? schema.required("This field is required.").test({
            test: (value) => {
              return moment(value).isBetween(
                moment(SNAPSHOT_START_DATE),
                moment(),
              );
            },
            message: `The date must be after ${moment(
              SNAPSHOT_START_DATE,
            ).format(DISPLAY_DATE_FORMAT)} and not in the future.`,
          })
        : schema,
    ),
    gpg_key: Yup.string().when("hasPockets", (values, schema) =>
      values[0] ? schema.required("This field is required.") : schema,
    ),
    pockets: Yup.array().of(Yup.string()),
    components: Yup.array()
      .of(Yup.string())
      .when("hasPockets", (values, schema) =>
        values[0]
          ? schema.min(1, "Please choose at least one component.")
          : schema,
      ),
    architectures: Yup.array()
      .of(Yup.string())
      .when("hasPockets", (values, schema) =>
        values[0]
          ? schema.min(1, "Please choose at least one architecture.")
          : schema,
      ),
    include_udeb: Yup.boolean().required(),
  });
};
