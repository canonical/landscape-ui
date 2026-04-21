import { DISPLAY_DATE_FORMAT } from "@/constants";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import moment from "moment";
import * as Yup from "yup";
import { MIN_SELECTION_COUNT } from "../../constants";
import type { Distribution } from "../../types";
import { INITIAL_VALUES, SNAPSHOT_START_DATE } from "./constants";
import type { FormProps } from "./types";

export const getStrippedUrl = (url: string): string =>
  url.replace(/\/[^\\/@]*@/, "/");

export const getInitialValues = (distribution?: Distribution): FormProps => {
  return distribution
    ? { ...INITIAL_VALUES, distribution: distribution.name }
    : INITIAL_VALUES;
};

export const getValidationSchema = (
  distributions: Distribution[],
  distribution?: Distribution,
): Yup.Schema => {
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
                .find(({ name }) => name === context.parent.distribution)
                ?.series.map(({ name }) => name);

          return !seriesNames?.includes(value);
        },
        message: "It must be unique within series within the distribution.",
      }),
    hasPockets: Yup.boolean(),
    mirror_series: Yup.string(),
    mirror_gpg_key: Yup.string(),
    mirror_uri: Yup.string().when("hasPockets", ([value], schema) =>
      value ? schema.nonNullable().required("This field is required.") : schema,
    ),
    snapshotDate: Yup.string().when("type", ([value], schema) =>
      value === "ubuntu-snapshot"
        ? schema.required("This field is required.").test({
            test: (valueToTest) => {
              return moment(valueToTest).isBetween(
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
    gpg_key: Yup.string().when("hasPockets", ([value], schema) =>
      value ? schema.required("This field is required.") : schema,
    ),
    pockets: Yup.array().of(Yup.string()),
    components: Yup.array()
      .of(Yup.string())
      .when("hasPockets", ([value], schema) =>
        value
          ? schema.min(
              MIN_SELECTION_COUNT,
              "Please choose at least one component.",
            )
          : schema,
      ),
    architectures: Yup.array()
      .of(Yup.string())
      .when("hasPockets", ([value], schema) =>
        value
          ? schema.min(
              MIN_SELECTION_COUNT,
              "Please choose at least one architecture.",
            )
          : schema,
      ),
    include_udeb: Yup.boolean().required(),
  });
};
