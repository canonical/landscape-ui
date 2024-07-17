import { useFormik } from "formik";
import moment from "moment";
import { ChangeEvent, FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import CheckboxGroup from "@/components/form/CheckboxGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import {
  DEFAULT_MIRROR_URI,
  DEFAULT_SNAPSHOT_URI,
  DISPLAY_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  SNAPSHOT_START_DATE,
  SNAPSHOT_TIMESTAMP_FORMAT,
} from "@/constants";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  POCKET_OPTIONS,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "@/data/series";
import useDebug from "@/hooks/useDebug";
import useDistributions from "@/hooks/useDistributions";
import useGPGKeys from "@/hooks/useGPGKeys";
import useSeries, { CreateSeriesParams } from "@/hooks/useSeries";
import useSidePanel from "@/hooks/useSidePanel";
import { Distribution } from "@/types/Distribution";
import { SelectOption } from "@/types/SelectOption";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import { getStrippedUrl } from "./helpers";

interface FormProps extends CreateSeriesParams {
  type: "ubuntu" | "ubuntu-snapshot" | "third-party";
  pockets: string[];
  components: string[];
  architectures: string[];
  hasPockets: boolean;
  snapshotDate: string;
}

interface NewSeriesFormProps {
  distribution?: Distribution;
  ctaText?: string;
}

const NewSeriesForm: FC<NewSeriesFormProps> = ({
  distribution,
  ctaText = "Add mirror",
}) => {
  const [mirrorUri, setMirrorUri] = useState(DEFAULT_MIRROR_URI);
  const [seriesOptions, setSeriesOptions] = useState<SelectOption[]>([]);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getGPGKeysQuery } = useGPGKeys();
  const { createSeriesQuery, getRepoInfo } = useSeries();
  const { getDistributionsQuery } = useDistributions();

  const { data: getDistributionsQueryResult } = getDistributionsQuery(
    { include_latest_sync: true },
    { enabled: !distribution },
  );

  const distributions = getDistributionsQueryResult?.data ?? [];

  const { data: gpgKeysData } = getGPGKeysQuery();

  const { mutateAsync: createSeries, isLoading: isCreating } =
    createSeriesQuery;

  const gpgKeys = gpgKeysData?.data ?? [];

  const distributionOptions: SelectOption[] = distributions.map(({ name }) => ({
    label: name,
    value: name,
  }));

  const formik = useFormik<FormProps>({
    initialValues: {
      type: "ubuntu",
      name: "",
      distribution: "",
      mirror_series: "",
      mirror_uri: "",
      gpg_key: "",
      pockets: [],
      components: [],
      architectures: [],
      include_udeb: false,
      hasPockets: false,
      snapshotDate: moment().format(INPUT_DATE_FORMAT),
    },
    validationSchema: Yup.object().shape({
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
    }),
    onSubmit: async (values) => {
      try {
        await createSeries({
          name: values.name,
          distribution: values.distribution,
          mirror_series: values.mirror_series,
          gpg_key: values.gpg_key,
          include_udeb: values.include_udeb,
          mirror_uri: values.mirror_uri,
          components: values.components,
          pockets: values.pockets,
          architectures: values.architectures,
          mirror_gpg_key: values.mirror_gpg_key,
        });

        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleSnapshotDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("snapshotDate", event.target.value);
    formik.setFieldValue(
      "mirror_uri",
      `${DEFAULT_SNAPSHOT_URI}/${moment(event.target.value).format(
        SNAPSHOT_TIMESTAMP_FORMAT,
      )}`,
    );
  };

  useEffect(() => {
    if (!distribution) {
      return;
    }

    formik.setFieldValue("distribution", distribution.name);
  }, [distribution]);

  useEffect(() => {
    if ("third-party" === formik.values.type) {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.thirdParty);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.thirdParty);
      formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.thirdParty,
      );
    } else {
      formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      formik.setFieldValue("architectures", PRE_SELECTED_ARCHITECTURES.ubuntu);

      if (
        "ubuntu" === formik.values.type &&
        !formik.values.mirror_uri?.startsWith(DEFAULT_MIRROR_URI)
      ) {
        formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
        setMirrorUri(DEFAULT_MIRROR_URI);
      }
    }
  }, [formik.values.type]);

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("type", event.target.value);

    if ("ubuntu" === event.target.value) {
      formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
      setMirrorUri(DEFAULT_MIRROR_URI);
    } else if ("third-party" === event.target.value) {
      formik.setFieldValue("mirror_uri", "");
      setMirrorUri("");
    } else if ("ubuntu-snapshot" === event.target.value) {
      formik.setFieldValue(
        "mirror_uri",
        `${DEFAULT_SNAPSHOT_URI}/${moment(formik.values.snapshotDate).format(
          SNAPSHOT_TIMESTAMP_FORMAT,
        )}`,
      );
      setMirrorUri(DEFAULT_MIRROR_URI);
    }
  };

  const handleMirrorSeriesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    formik.setFieldValue("mirror_series", value);

    if (!value || formik.values.name) {
      return;
    }

    formik.setFieldValue(
      "name",
      "ubuntu-snapshot" === formik.values.type
        ? `${value}-snapshot-${moment(formik.values.snapshotDate).format(
            INPUT_DATE_FORMAT,
          )}`
        : value,
    );
  };

  useEffect(() => {
    if (0 === formik.values.pockets.length || !formik.values.pockets[0]) {
      formik.setFieldValue("hasPockets", false);

      return;
    }

    formik.setFieldValue("hasPockets", true);
  }, [formik.values.pockets.length, formik.values.pockets[0]]);

  const { data: getRepoInfoResult } = getRepoInfo(
    {
      mirror_uri: getStrippedUrl(mirrorUri),
    },
    {
      enabled: !!mirrorUri,
    },
  );

  const repoInfo = getRepoInfoResult?.data;

  useEffect(() => {
    if (!repoInfo) {
      setSeriesOptions([]);
      return;
    }

    if (repoInfo.ubuntu) {
      if (formik.values.mirror_uri?.startsWith(DEFAULT_MIRROR_URI)) {
        formik.setFieldValue("type", "ubuntu");
      }
    } else {
      formik.setFieldValue("type", "third-party");
    }

    setSeriesOptions(
      repoInfo.repos.map(({ description, repo }) => ({
        label: repoInfo.ubuntu ? description : repo,
        value: repo,
      })),
    );
  }, [repoInfo]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Type"
        required
        options={[
          { label: "Ubuntu Archive", value: "ubuntu" },
          {
            label: "Ubuntu Snapshot",
            value: "ubuntu-snapshot",
          },
          { label: "Third party", value: "third-party" },
        ]}
        {...formik.getFieldProps("type")}
        onChange={handleTypeChange}
        error={
          formik.touched.type && formik.errors.type
            ? formik.errors.type
            : undefined
        }
      />

      {"ubuntu-snapshot" !== formik.values.type && (
        <Input
          type="text"
          label="Mirror URI"
          required={formik.values.hasPockets}
          help="Absolute URL or file path"
          {...formik.getFieldProps("mirror_uri")}
          onBlur={(event) => {
            setMirrorUri(event.target.value);
          }}
          error={
            formik.touched.mirror_uri && formik.errors.mirror_uri
              ? formik.errors.mirror_uri
              : undefined
          }
        />
      )}

      {"ubuntu-snapshot" === formik.values.type && (
        <Input
          type="date"
          min={moment(SNAPSHOT_START_DATE).format(INPUT_DATE_FORMAT)}
          max={moment().format(INPUT_DATE_FORMAT)}
          label="Snapshot date"
          required
          {...formik.getFieldProps("snapshotDate")}
          onChange={handleSnapshotDateChange}
          error={
            formik.touched.snapshotDate && formik.errors.snapshotDate
              ? formik.errors.snapshotDate
              : undefined
          }
          help={`Starting from ${moment(SNAPSHOT_START_DATE).format(
            DISPLAY_DATE_FORMAT,
          )} in dd.mm.yyyy format`}
        />
      )}

      {!distribution && (
        <Select
          label="Distribution"
          required
          options={[
            { label: "Select distribution", value: "" },
            ...distributionOptions,
          ]}
          {...formik.getFieldProps("distribution")}
          error={
            formik.touched.distribution && formik.errors.distribution
              ? formik.errors.distribution
              : undefined
          }
        />
      )}

      <Row className="u-no-padding">
        <Col size={6} medium={3} small={2}>
          <Select
            label="Mirror series"
            options={[{ label: "Select series", value: "" }, ...seriesOptions]}
            {...formik.getFieldProps("mirror_series")}
            onChange={handleMirrorSeriesChange}
            error={
              formik.touched.mirror_series && formik.errors.mirror_series
                ? formik.errors.mirror_series
                : undefined
            }
          />
        </Col>
        <Col size={6} medium={3} small={2}>
          <Input
            type="text"
            label="Series name"
            required
            {...formik.getFieldProps("name")}
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : undefined
            }
          />
        </Col>
      </Row>

      <Row className="u-no-padding">
        {"ubuntu-snapshot" !== formik.values.type && (
          <Col size={6} medium={3} small={2}>
            <Select
              label="Mirror GPG key"
              options={[
                { label: "Select mirror GPG key", value: "" },
                ...gpgKeys
                  .filter(({ has_secret }) => !has_secret)
                  .map(({ name }) => ({
                    label: name,
                    value: name,
                  })),
              ]}
              {...formik.getFieldProps("mirror_gpg_key")}
              error={
                formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
                  ? formik.errors.mirror_gpg_key
                  : undefined
              }
              help="If none is given, the stock Ubuntu archive one will be used."
            />
          </Col>
        )}

        <Col size={6} medium={3} small={2}>
          <Select
            label="GPG key"
            required={formik.values.hasPockets}
            options={[
              { label: "Select GPG key", value: "" },
              ...gpgKeys
                .filter(({ has_secret }) => has_secret)
                .map(({ name }) => ({
                  label: name,
                  value: name,
                })),
            ]}
            {...formik.getFieldProps("gpg_key")}
            error={
              formik.touched.gpg_key && formik.errors.gpg_key
                ? formik.errors.gpg_key
                : undefined
            }
          />
        </Col>
      </Row>

      {["ubuntu", "ubuntu-snapshot"].includes(formik.values.type) && (
        <>
          <CheckboxGroup
            label="Pockets"
            style={{ marginTop: "1.5rem" }}
            options={POCKET_OPTIONS}
            {...formik.getFieldProps("pockets")}
            onChange={(newOptions) => {
              formik.setFieldValue("pockets", newOptions);
            }}
            error={
              formik.touched.pockets && formik.errors.pockets
                ? formik.errors.pockets
                : undefined
            }
          />
          <CheckboxGroup
            label="Components"
            required={formik.values.hasPockets}
            options={COMPONENT_OPTIONS}
            {...formik.getFieldProps("components")}
            onChange={(newOptions) => {
              formik.setFieldValue("components", newOptions);
            }}
            error={
              formik.touched.components && formik.errors.components
                ? formik.errors.components
                : undefined
            }
          />
          <CheckboxGroup
            label="Architectures"
            required={formik.values.hasPockets}
            options={ARCHITECTURE_OPTIONS}
            {...formik.getFieldProps("architectures")}
            onChange={(newOptions) => {
              formik.setFieldValue("architectures", newOptions);
            }}
            error={
              formik.touched.architectures && formik.errors.architectures
                ? formik.errors.architectures
                : undefined
            }
          />
        </>
      )}

      {"third-party" === formik.values.type && (
        <>
          <Input
            type="text"
            label="Pockets"
            placeholder="E.g. releases, security, etc."
            {...formik.getFieldProps("pockets")}
            value={formik.values.pockets.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "pockets",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={
              formik.touched.pockets && formik.errors.pockets
                ? formik.errors.pockets
                : undefined
            }
            help="List the pocket names separated by commas"
          />
          <Input
            type="text"
            label="Components"
            required={formik.values.hasPockets}
            placeholder="E.g. main, universe, etc."
            {...formik.getFieldProps("components")}
            value={formik.values.components.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={
              formik.touched.components && formik.errors.components
                ? formik.errors.components
                : undefined
            }
            help="List the component names separated by commas"
          />
          <Input
            type="text"
            label="Architectures"
            required={formik.values.hasPockets}
            placeholder="E.g. amd64, riscv, etc."
            {...formik.getFieldProps("architectures")}
            value={formik.values.architectures.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "architectures",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={
              formik.touched.architectures && formik.errors.architectures
                ? formik.errors.architectures
                : undefined
            }
            help="List the architectures separated by commas"
          />
        </>
      )}

      <UdebCheckboxInput formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={isCreating}
        submitButtonText={ctaText}
      />
    </Form>
  );
};

export default NewSeriesForm;
