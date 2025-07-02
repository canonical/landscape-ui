import CheckboxGroup from "@/components/form/CheckboxGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import { DISPLAY_DATE_FORMAT, INPUT_DATE_FORMAT } from "@/constants";

import { useGPGKeys } from "@/features/gpg-keys";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
  DEFAULT_MIRROR_URI,
  DEFAULT_SNAPSHOT_URI,
  PRE_SELECTED_ARCHITECTURES,
  PRE_SELECTED_COMPONENTS,
  PRE_SELECTED_POCKETS,
} from "../../constants";
import { useDistributions, useSeries } from "../../hooks";
import type { Distribution } from "../../types";
import {
  POCKET_OPTIONS,
  SNAPSHOT_START_DATE,
  SNAPSHOT_TIMESTAMP_FORMAT,
} from "./constants";
import {
  getInitialValues,
  getStrippedUrl,
  getValidationSchema,
} from "./helpers";
import type { FormProps } from "./types";

interface NewSeriesFormProps {
  readonly distribution?: Distribution;
  readonly ctaText?: string;
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

  const { mutateAsync: createSeries } = createSeriesQuery;

  const gpgKeys = gpgKeysData?.data ?? [];

  const distributionOptions: SelectOption[] = distributions.map(({ name }) => ({
    label: name,
    value: name,
  }));

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues(distribution),
    validationSchema: getValidationSchema(distributions, distribution),
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

  const handleSnapshotDateChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    await formik.setFieldValue("snapshotDate", event.target.value);
    await formik.setFieldValue(
      "mirror_uri",
      `${DEFAULT_SNAPSHOT_URI}/${moment(event.target.value).format(
        SNAPSHOT_TIMESTAMP_FORMAT,
      )}`,
    );
  };

  const handleTypeChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    await formik.setFieldValue("type", event.target.value);

    if ("ubuntu" === event.target.value) {
      await formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      await formik.setFieldValue("hasPockets", true);
      await formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      await formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.ubuntu,
      );

      if (!formik.values.mirror_uri?.startsWith(DEFAULT_MIRROR_URI)) {
        await formik.setFieldValue("mirror_uri", DEFAULT_MIRROR_URI);
      }

      setMirrorUri(DEFAULT_MIRROR_URI);
    } else if ("third-party" === event.target.value) {
      await formik.setFieldValue("mirror_uri", "");
      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.thirdParty);
      await formik.setFieldValue("hasPockets", true);
      await formik.setFieldValue(
        "components",
        PRE_SELECTED_COMPONENTS.thirdParty,
      );
      await formik.setFieldValue(
        "architectures",
        PRE_SELECTED_ARCHITECTURES.thirdParty,
      );
      setMirrorUri("");
    } else if ("ubuntu-snapshot" === event.target.value) {
      await formik.setFieldValue(
        "mirror_uri",
        `${DEFAULT_SNAPSHOT_URI}/${moment(formik.values.snapshotDate).format(
          SNAPSHOT_TIMESTAMP_FORMAT,
        )}`,
      );
      await formik.setFieldValue("pockets", PRE_SELECTED_POCKETS.ubuntu);
      await formik.setFieldValue("hasPockets", true);
      await formik.setFieldValue("components", PRE_SELECTED_COMPONENTS.ubuntu);
      setMirrorUri(DEFAULT_MIRROR_URI);
    }
  };

  const handleMirrorSeriesChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const { value } = event.target;

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

  const { data: { data: repoInfo } = { data: undefined } } = getRepoInfo(
    {
      mirror_uri: getStrippedUrl(mirrorUri),
    },
    {
      enabled: !!mirrorUri,
    },
  );

  useEffect(() => {
    if (!repoInfo) {
      setSeriesOptions([]);
      return;
    }

    if (!repoInfo.ubuntu) {
      formik.setFieldValue("type", "third-party");
    } else if (formik.values.mirror_uri?.startsWith(DEFAULT_MIRROR_URI)) {
      formik.setFieldValue("type", "ubuntu");
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
        error={getFormikError(formik, "type")}
      />

      {"ubuntu-snapshot" !== formik.values.type ? (
        <Input
          type="text"
          label="Mirror URI"
          required={formik.values.hasPockets}
          help="Absolute URL or file path"
          {...formik.getFieldProps("mirror_uri")}
          onBlur={(event) => {
            setMirrorUri(event.target.value);
          }}
          error={getFormikError(formik, "mirror_uri")}
        />
      ) : (
        <Input
          type="date"
          min={moment(SNAPSHOT_START_DATE).format(INPUT_DATE_FORMAT)}
          max={moment().format(INPUT_DATE_FORMAT)}
          label="Snapshot date"
          required
          {...formik.getFieldProps("snapshotDate")}
          onChange={handleSnapshotDateChange}
          error={getFormikError(formik, "snapshotDate")}
          help={`Starting from approximately ${moment(
            SNAPSHOT_START_DATE,
          ).format(DISPLAY_DATE_FORMAT)} in dd.mm.yyyy format`}
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
          error={getFormikError(formik, "distribution")}
        />
      )}

      <Row className="u-no-padding">
        <Col size={6} medium={3} small={2}>
          <Select
            label="Mirror series"
            options={[{ label: "Select series", value: "" }, ...seriesOptions]}
            {...formik.getFieldProps("mirror_series")}
            onChange={handleMirrorSeriesChange}
            error={getFormikError(formik, "mirror_series")}
          />
        </Col>
        <Col size={6} medium={3} small={2}>
          <Input
            type="text"
            label="Series name"
            required
            {...formik.getFieldProps("name")}
            error={getFormikError(formik, "name")}
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
              error={getFormikError(formik, "mirror_gpg_key")}
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
            error={getFormikError(formik, "gpg_key")}
          />
        </Col>
      </Row>

      {"third-party" !== formik.values.type ? (
        <>
          <CheckboxGroup
            label="Pockets"
            style={{ marginTop: "1.5rem" }}
            options={POCKET_OPTIONS}
            {...formik.getFieldProps("pockets")}
            onChange={async (newOptions) => {
              await formik.setFieldValue("pockets", newOptions);
              await formik.setFieldValue("hasPockets", !!newOptions.length);
            }}
            error={getFormikError(formik, "pockets")}
          />
          <CheckboxGroup
            label="Components"
            required={formik.values.hasPockets}
            options={COMPONENT_OPTIONS}
            {...formik.getFieldProps("components")}
            onChange={async (newOptions) => {
              await formik.setFieldValue("components", newOptions);
            }}
            error={getFormikError(formik, "components")}
          />
          <CheckboxGroup
            label="Architectures"
            required={formik.values.hasPockets}
            options={ARCHITECTURE_OPTIONS}
            {...formik.getFieldProps("architectures")}
            onChange={async (newOptions) => {
              await formik.setFieldValue("architectures", newOptions);
            }}
            error={getFormikError(formik, "architectures")}
          />
        </>
      ) : (
        <>
          <Input
            type="text"
            label="Pockets"
            placeholder="E.g. releases, security, etc."
            {...formik.getFieldProps("pockets")}
            value={formik.values.pockets.join(",")}
            onChange={async (event) => {
              await formik.setFieldValue(
                "pockets",
                event.target.value.replace(/\s/g, "").split(","),
              );

              await formik.setFieldValue("hasPockets", !!event.target.value);
            }}
            error={getFormikError(formik, "pockets")}
            help="List the pocket names separated by commas."
          />
          <Input
            type="text"
            label="Components"
            required={formik.values.hasPockets}
            placeholder="E.g. main, universe, etc."
            {...formik.getFieldProps("components")}
            value={formik.values.components.join(",")}
            onChange={async (event) => {
              await formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={getFormikError(formik, "components")}
            help="List the component names separated by commas."
          />
          <Input
            type="text"
            label="Architectures"
            required={formik.values.hasPockets}
            placeholder="E.g. amd64, riscv, etc."
            {...formik.getFieldProps("architectures")}
            value={formik.values.architectures.join(",")}
            onChange={async (event) => {
              await formik.setFieldValue(
                "architectures",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={getFormikError(formik, "architectures")}
            help="List the architectures separated by commas."
          />
        </>
      )}

      <UdebCheckboxInput formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={ctaText}
      />
    </Form>
  );
};

export default NewSeriesForm;
