import { useFormik } from "formik";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import CheckboxGroup from "@/components/form/CheckboxGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UdebCheckboxInput from "@/components/form/UdebCheckboxInput";
import {
  DEFAULT_MIRROR_URI,
  DISPLAY_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  SNAPSHOT_START_DATE,
} from "@/constants";
import useDebug from "@/hooks/useDebug";
import useDistributions from "@/hooks/useDistributions";
import useGPGKeys from "@/hooks/useGPGKeys";
import useSeries from "@/hooks/useSeries";
import useSidePanel from "@/hooks/useSidePanel";
import { Distribution } from "@/types/Distribution";
import { INITIAL_VALUES, TYPE_OPTIONS } from "./constants";
import {
  getArchitectureOptions,
  getComponentOptions,
  getDistributionOptions,
  getFormikError,
  getGpgKeyOptions,
  getHandleCategoryChange,
  getHandleMirrorSeriesChange,
  getHandleSnapshotDateChange,
  getHandleTypeChange,
  getPocketOptions,
  getSeriesOptions,
  getStrippedUrl,
  getUbuntuProCategoryOptions,
  getValidationSchema,
} from "./helpers";
import { FormProps } from "./types";

interface NewSeriesFormProps {
  distribution?: Distribution;
  ctaText?: string;
}

const NewSeriesForm: FC<NewSeriesFormProps> = ({
  distribution,
  ctaText = "Add mirror",
}) => {
  const [mirrorUri, setMirrorUri] = useState(DEFAULT_MIRROR_URI);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getGPGKeysQuery } = useGPGKeys();
  const { createSeriesQuery, getRepoInfo, getUbuntuProCategoriesQuery } =
    useSeries();
  const { getDistributionsQuery } = useDistributions();

  const { data: getDistributionsQueryResult } = getDistributionsQuery(
    { include_latest_sync: true },
    { enabled: !distribution },
  );

  const distributions = getDistributionsQueryResult?.data ?? [];

  const { data: gpgKeysData } = getGPGKeysQuery();

  const { mutateAsync: createSeries, isLoading: isCreating } =
    createSeriesQuery;

  const handleSubmit = async (values: FormProps) => {
    try {
      const mirror_uri =
        values.type !== "ubuntu-pro"
          ? values.mirror_uri
          : values.mirror_uri.replace(
              /^https:\/\//,
              (protocol) => `${protocol}${values.token}@`,
            );

      await createSeries({
        architectures: values.architectures,
        components: values.components,
        distribution: values.distribution,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        mirror_gpg_key: values.mirror_gpg_key,
        mirror_series: values.mirror_series,
        mirror_uri,
        name: values.name,
        pockets: values.pockets,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: getValidationSchema(distributions, distribution),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (!distribution) {
      return;
    }

    formik.setFieldValue("distribution", distribution.name);
  }, [distribution]);

  const { data: getRepoInfoResult } = getRepoInfo(
    {
      mirror_uri: getStrippedUrl(mirrorUri),
    },
    {
      enabled: !!mirrorUri,
    },
  );

  const { data: ubuntuProCategories } = getUbuntuProCategoriesQuery(
    {},
    {
      enabled: formik.values.type === "ubuntu-pro",
    },
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Type"
        required
        options={TYPE_OPTIONS}
        {...formik.getFieldProps("type")}
        onChange={getHandleTypeChange(formik, (uri) => setMirrorUri(uri))}
        error={getFormikError(formik, "type")}
      />

      {["ubuntu", "third-party"].includes(formik.values.type) && (
        <Input
          type="text"
          label="Mirror URI"
          required={formik.values.pockets.length > 0}
          help="Absolute URL or file path"
          {...formik.getFieldProps("mirror_uri")}
          onBlur={(event) => {
            formik.handleBlur(event);
            setMirrorUri(event.target.value);
          }}
          error={getFormikError(formik, "mirror_uri")}
        />
      )}

      {"ubuntu-pro" === formik.values.type && (
        <>
          <Select
            label="Category"
            required={formik.values.pockets.length > 0}
            options={getUbuntuProCategoryOptions(ubuntuProCategories)}
            {...formik.getFieldProps("mirror_uri")}
            onChange={getHandleCategoryChange(
              formik,
              ubuntuProCategories,
              (uri) => setMirrorUri(uri),
            )}
            error={getFormikError(formik, "mirror_uri")}
          />
          <Input
            type="text"
            label="Bearer token"
            autoComplete="off"
            required={formik.values.pockets.length > 0}
            {...formik.getFieldProps("token")}
            error={getFormikError(formik, "token")}
          />
        </>
      )}

      {"ubuntu-snapshot" === formik.values.type && (
        <Input
          type="date"
          min={moment(SNAPSHOT_START_DATE).format(INPUT_DATE_FORMAT)}
          max={moment().format(INPUT_DATE_FORMAT)}
          label="Snapshot date"
          required
          {...formik.getFieldProps("snapshotDate")}
          onChange={getHandleSnapshotDateChange(formik)}
          error={getFormikError(formik, "snapshotDate")}
          help={`Starting from ${moment(SNAPSHOT_START_DATE).format(
            DISPLAY_DATE_FORMAT,
          )} in dd.mm.yyyy format`}
        />
      )}

      {!distribution && (
        <Select
          label="Distribution"
          required
          options={getDistributionOptions(distributions)}
          {...formik.getFieldProps("distribution")}
          error={getFormikError(formik, "distribution")}
        />
      )}

      <Row className="u-no-padding">
        <Col size={6} medium={3} small={2}>
          <Select
            label="Mirror series"
            options={getSeriesOptions(
              formik,
              getRepoInfoResult?.data,
              ubuntuProCategories,
            )}
            {...formik.getFieldProps("mirror_series")}
            onChange={getHandleMirrorSeriesChange(formik)}
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

      {["ubuntu", "ubuntu-snapshot", "third-party"].includes(
        formik.values.type,
      ) && (
        <Row className="u-no-padding">
          {["ubuntu", "third-party"].includes(formik.values.type) && (
            <Col size={6} medium={3} small={2}>
              <Select
                label="Mirror GPG key"
                options={getGpgKeyOptions(gpgKeysData?.data, false)}
                {...formik.getFieldProps("mirror_gpg_key")}
                error={getFormikError(formik, "mirror_gpg_key")}
                help="If none is given, the stock Ubuntu archive one will be used."
              />
            </Col>
          )}

          <Col size={6} medium={3} small={2}>
            <Select
              label="GPG key"
              required={formik.values.pockets.length > 0}
              options={getGpgKeyOptions(gpgKeysData?.data, true)}
              {...formik.getFieldProps("gpg_key")}
              error={getFormikError(formik, "gpg_key")}
            />
          </Col>
        </Row>
      )}

      {["ubuntu", "ubuntu-pro", "ubuntu-snapshot"].includes(
        formik.values.type,
      ) && (
        <>
          <CheckboxGroup
            label="Pockets"
            style={{ marginTop: "1.5rem" }}
            options={getPocketOptions(formik, ubuntuProCategories)}
            {...formik.getFieldProps("pockets")}
            onChange={(newOptions) => {
              formik.setFieldValue("pockets", newOptions);
            }}
            error={getFormikError(formik, "pockets")}
          />
          <CheckboxGroup
            label="Components"
            required={formik.values.pockets.length > 0}
            options={getComponentOptions(formik, ubuntuProCategories)}
            {...formik.getFieldProps("components")}
            onChange={(newOptions) => {
              formik.setFieldValue("components", newOptions);
            }}
            error={getFormikError(formik, "components")}
          />
          <CheckboxGroup
            label="Architectures"
            required={formik.values.pockets.length > 0}
            options={getArchitectureOptions(formik, ubuntuProCategories)}
            {...formik.getFieldProps("architectures")}
            onChange={(newOptions) => {
              formik.setFieldValue("architectures", newOptions);
            }}
            error={getFormikError(formik, "architectures")}
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
            error={getFormikError(formik, "pockets")}
            help="List the pocket names separated by commas"
          />
          <Input
            type="text"
            label="Components"
            required={formik.values.pockets.length > 0}
            placeholder="E.g. main, universe, etc."
            {...formik.getFieldProps("components")}
            value={formik.values.components.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "components",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={getFormikError(formik, "components")}
            help="List the component names separated by commas"
          />
          <Input
            type="text"
            label="Architectures"
            required={formik.values.pockets.length > 0}
            placeholder="E.g. amd64, riscv, etc."
            {...formik.getFieldProps("architectures")}
            value={formik.values.architectures.join(",")}
            onChange={(event) => {
              formik.setFieldValue(
                "architectures",
                event.target.value.replace(/\s/g, "").split(","),
              );
            }}
            error={getFormikError(formik, "architectures")}
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
