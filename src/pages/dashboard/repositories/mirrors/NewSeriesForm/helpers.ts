import moment from "moment/moment";
import * as Yup from "yup";
import {
  DEFAULT_MIRROR_URI,
  DEFAULT_MIRROR_URI_PRO,
  DEFAULT_SNAPSHOT_URI,
  DISPLAY_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  SNAPSHOT_START_DATE,
  SNAPSHOT_TIMESTAMP_FORMAT,
} from "@/constants";
import { Distribution } from "@/types/Distribution";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import { FormProps } from "./types";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "@/data/series";
import { ChangeEvent } from "react";
import { FormikContextType } from "formik";
import { RepoInfo } from "@/hooks/useSeries";
import { CATEGORIES_LABELS } from "@/pages/dashboard/repositories/mirrors/NewSeriesForm/constants";
import { UbuntuProCategory } from "@/types/UbuntuProCategory";
import { GPGKey } from "@/types/GPGKey";

export const getStrippedUrl = (url: string) => url.replace(/\/[^\\/@]*@/, "/");

export const getValidationSchema = (
  distributions: Distribution[],
  distribution: Distribution | undefined,
) =>
  Yup.object().shape({
    architectures: Yup.array()
      .of(Yup.string())
      .when("pockets", {
        is: (pockets: string[]) => pockets.length > 0,
        then: (schema) =>
          schema.min(1, "Please choose at least one architecture."),
      }),
    components: Yup.array()
      .of(Yup.string())
      .when("pockets", {
        is: (pockets: string[]) => pockets.length > 0,
        then: (schema) =>
          schema.min(1, "Please choose at least one component."),
      }),
    distribution: Yup.string().required("This field is required."),
    gpg_key: Yup.string().when(["pockets", "type"], {
      is: (pockets: string[], type: FormProps["type"]) =>
        ["ubuntu", "ubuntu-snapshot", "third-party"].includes(type) &&
        pockets.length > 0,
      then: (schema) => schema.required("This field is required."),
    }),
    include_udeb: Yup.boolean().required(),
    mirror_gpg_key: Yup.string(),
    mirror_series: Yup.string(),
    mirror_uri: Yup.string().when("pockets", {
      is: (pockets: string[]) => pockets.length > 0,
      then: (schema) => schema.required("This field is required."),
    }),
    name: Yup.string()
      .required("This field is required.")
      .test(testLowercaseAlphaNumeric)
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
    pockets: Yup.array().of(Yup.string()),
    snapshotDate: Yup.string().when("type", {
      is: "ubuntu-snapshot",
      then: (schema) =>
        schema.required("This field is required.").test({
          test: (value) => {
            return moment(value).isBetween(
              moment(SNAPSHOT_START_DATE),
              moment(),
            );
          },
          message: `The date must be after ${moment(SNAPSHOT_START_DATE).format(
            DISPLAY_DATE_FORMAT,
          )} and not in the future.`,
        }),
    }),
    token: Yup.string().when(["pockets", "type"], {
      is: (pockets: string[], type: FormProps["type"]) =>
        type === "ubuntu-pro" && pockets.length > 0,
      then: (schema) => schema.required("This field is required."),
    }),
    type: Yup.string<FormProps["type"]>().required("This field is required."),
  });

export const getDistributionOptions = (distributions: Distribution[]) => {
  return [
    {
      label: "Select distribution",
      value: "",
    },
    ...distributions.map(({ name }) => ({ label: name, value: name })),
  ];
};

export const getSeriesOptions = (
  formik: FormikContextType<FormProps>,
  repoInfo: RepoInfo | undefined,
  categories: UbuntuProCategory[] | undefined,
) => {
  const options = [{ label: "Select series", value: "" }];

  if (
    (formik.values.type === "ubuntu-pro" && !categories) ||
    (formik.values.type !== "ubuntu-pro" && !repoInfo)
  ) {
    return options;
  }

  if (formik.values.type === "ubuntu-pro") {
    options.push(
      ...(categories
        ?.find(({ mirror_uri }) => mirror_uri === formik.values.mirror_uri)
        ?.series.map((mirror) => ({
          label: mirror,
          value: mirror,
        })) ?? []),
    );
  } else {
    options.push(
      ...(repoInfo?.repos.map(({ description, repo }) => ({
        label: repoInfo?.ubuntu ? description : repo,
        value: repo,
      })) ?? []),
    );
  }

  return options;
};

export const getGpgKeyOptions = (
  gpgKeys: GPGKey[] | undefined,
  secure: boolean,
) => {
  return [
    {
      label: "Select GPG key",
      value: "",
    },
    ...(gpgKeys
      ?.filter(({ has_secret }) => (secure ? has_secret : !has_secret))
      .map(({ name }) => ({
        label: name,
        value: name,
      })) ?? []),
  ];
};

export const getPocketOptions = (
  formik: FormikContextType<FormProps>,
  categories: UbuntuProCategory[] | undefined,
) => {
  return POCKET_OPTIONS.filter(
    ({ value }) =>
      formik.values.type !== "ubuntu-pro" ||
      (
        categories?.find(
          ({ mirror_uri }) => mirror_uri === formik.values.mirror_uri,
        )?.pockets ?? []
      ).includes(value),
  );
};

export const getComponentOptions = (
  formik: FormikContextType<FormProps>,
  categories: UbuntuProCategory[] | undefined,
) => {
  return formik.values.type !== "ubuntu-pro"
    ? COMPONENT_OPTIONS
    : (
        categories?.find(
          ({ mirror_uri }) => mirror_uri === formik.values.mirror_uri,
        )?.components ?? []
      ).map((component) => ({ label: component, value: component }));
};

export const getArchitectureOptions = (
  formik: FormikContextType<FormProps>,
  categories: UbuntuProCategory[] | undefined,
) => {
  return formik.values.type !== "ubuntu-pro"
    ? ARCHITECTURE_OPTIONS
    : (
        categories?.find(
          ({ mirror_uri }) => mirror_uri === formik.values.mirror_uri,
        )?.architectures ?? []
      ).map((pocket) => ({ label: pocket, value: pocket }));
};

export const getUbuntuProCategoryOptions = (
  categories: UbuntuProCategory[] | undefined,
) => {
  return (
    categories?.map(({ mirror_type, mirror_uri }) => ({
      label: CATEGORIES_LABELS[mirror_type],
      value: mirror_uri,
    })) ?? []
  );
};

export const getHandleMirrorSeriesChange =
  (formik: FormikContextType<FormProps>) =>
  async (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    await formik.setFieldValue("mirror_series", value);

    if (!value || formik.values.name) {
      return;
    }

    await formik.setFieldValue(
      "name",
      "ubuntu-snapshot" === formik.values.type
        ? `${value}-snapshot-${moment(formik.values.snapshotDate).format(
            INPUT_DATE_FORMAT,
          )}`
        : value,
    );
  };

export const getHandleTypeChange =
  (
    formik: FormikContextType<FormProps>,
    onMirrorUriChange: (uri: string) => void,
  ) =>
  async (event: ChangeEvent<HTMLSelectElement>) => {
    await formik.setFieldValue("type", event.target.value);

    if ("third-party" === event.target.value) {
      onMirrorUriChange("");

      await formik.setFieldValue("mirror_uri", "");
      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.thirdParty);
      await formik.setFieldValue(
        "components",
        PRE_SELECTED_COMPONENTS.thirdParty,
      );
      await formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.thirdParty,
      );
    } else if ("ubuntu-pro" === event.target.value) {
      onMirrorUriChange(DEFAULT_MIRROR_URI_PRO);

      await formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI_PRO);
      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.pro);
      await formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.pro);
      await formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.pro,
      );
    } else {
      onMirrorUriChange(DEFAULT_MIRROR_URI);

      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      await formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      await formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.ubuntu,
      );

      if ("ubuntu-snapshot" === event.target.value) {
        await formik.setFieldValue(
          "mirror_uri",
          `${DEFAULT_SNAPSHOT_URI}/${moment(formik.values.snapshotDate).format(
            SNAPSHOT_TIMESTAMP_FORMAT,
          )}`,
        );
      } else if (
        "ubuntu" === event.target.value &&
        !formik.values.mirror_uri?.startsWith(DEFAULT_MIRROR_URI)
      ) {
        await formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
      }
    }
  };

export const getHandleSnapshotDateChange =
  (formik: FormikContextType<FormProps>) =>
  async (event: ChangeEvent<HTMLInputElement>) => {
    await formik.setFieldValue("snapshotDate", event.target.value);
    await formik.setFieldValue(
      "mirror_uri",
      `${DEFAULT_SNAPSHOT_URI}/${moment(event.target.value).format(
        SNAPSHOT_TIMESTAMP_FORMAT,
      )}`,
    );
  };

export const getHandleCategoryChange =
  (
    formik: FormikContextType<FormProps>,
    categories: UbuntuProCategory[] | undefined,
    onMirrorUriChange: (uri: string) => void,
  ) =>
  async (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    onMirrorUriChange(value);

    await formik.setFieldValue("mirror_uri", value);

    const selectedCategory = categories?.find(
      ({ mirror_uri }) => mirror_uri === value,
    );

    await formik.setFieldValue("pockets", selectedCategory?.pockets ?? []);
  };

export const getFormikError = (
  formik: FormikContextType<FormProps>,
  key: keyof FormProps,
) => {
  return formik.touched[key] ? formik.errors[key] : undefined;
};
