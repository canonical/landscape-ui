import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Form,
  Icon,
  Input,
  Select,
  Textarea,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo } from "react";
import classes from "./AddPublicationForm.module.scss";
import {
  INITIAL_VALUES,
  PUBLICATION_TARGET_OPTIONS,
  SETTINGS_HELP_TEXT,
  SOURCE_OPTIONS,
  SOURCE_TYPE_OPTIONS,
} from "./constants";
import { getPublicationPayload, VALIDATION_SCHEMA } from "./helpers";
import type { FormProps } from "./types";

const AddPublicationForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await Promise.resolve(getPublicationPayload(values));

        notify.success({
          title: "Publication queued",
          message: `Publication "${values.name}" has been queued for publishing.`,
        });

        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  const sourceOptions = useMemo(
    () => [
      { label: "Select source", value: "" },
      ...SOURCE_OPTIONS.filter(
        ({ sourceType }) => sourceType === formik.values.source_type,
      ).map(({ label, value }) => ({ label, value })),
    ],
    [formik.values.source_type],
  );

  const selectedSource = SOURCE_OPTIONS.find(
    ({ value }) => value === formik.values.source,
  );

  const componentOptions = useMemo(
    () => [
      {
        label: selectedSource?.label,
        value: "",
      },
      ...(selectedSource?.components ?? []).map((component) => ({
        label: component,
        value: component,
      })),
    ],
    [selectedSource],
  );

  const architectureOptions = useMemo(
    () => [
      {
        label: selectedSource?.label,
        value: "",
      },
      ...(selectedSource?.architectures ?? []).map((architecture) => ({
        label: architecture,
        value: architecture,
      })),
    ],
    [selectedSource],
  );

  const handleSourceTypeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    await formik.setFieldValue("source_type", event.target.value);
    await formik.setFieldValue("source", "");
    await formik.setFieldValue("uploader_distribution", "");
    await formik.setFieldValue("uploader_components", "");
    await formik.setFieldValue("uploader_architectures", "");
  };

  const handleSourceChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const sourceValue = event.target.value;
    const source = SOURCE_OPTIONS.find(({ value }) => value === sourceValue);

    await formik.setFieldValue("source", sourceValue);
    await formik.setFieldValue(
      "uploader_distribution",
      source?.distribution ?? "",
    );
    await formik.setFieldValue("uploader_components", "");
    await formik.setFieldValue("uploader_architectures", "");
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Blocks>
        <Blocks.Item
          title="Details"
          titleClassName={classNames(
            "p-text--small-caps",
            classes.sectionTitle,
          )}
          containerClassName={classes.section}
        >
          <Input
            type="text"
            label="Publication name"
            required
            error={getFormikError(formik, "name")}
            {...formik.getFieldProps("name")}
          />

          <Select
            label="Source type"
            required
            options={SOURCE_TYPE_OPTIONS}
            error={getFormikError(formik, "source_type")}
            {...formik.getFieldProps("source_type")}
            onChange={handleSourceTypeChange}
          />

          <Select
            label="Source"
            required
            disabled={!formik.values.source_type}
            options={sourceOptions}
            error={getFormikError(formik, "source")}
            {...formik.getFieldProps("source")}
            onChange={handleSourceChange}
          />

          <Select
            label="Publication target"
            required
            options={PUBLICATION_TARGET_OPTIONS}
            error={getFormikError(formik, "publication_target")}
            {...formik.getFieldProps("publication_target")}
          />

          <Input
            type="text"
            label="Directory prefix"
            error={getFormikError(formik, "prefix")}
            {...formik.getFieldProps("prefix")}
          />

          <span>Signing GPG key</span>

          <Input
            type="checkbox"
            label="Preserve mirror signing key"
            checked={formik.values.preserve_mirror_signing_key}
            {...formik.getFieldProps("preserve_mirror_signing_key")}
          />

          <Textarea
            label="Mirror signing key"
            rows={4}
            disabled={formik.values.preserve_mirror_signing_key}
            error={getFormikError(formik, "mirror_signing_key")}
            {...formik.getFieldProps("mirror_signing_key")}
            className="u-no-margin--bottom"
          />
        </Blocks.Item>

        <Blocks.Item
          title="Uploaders"
          titleClassName={classNames(
            "p-text--small-caps",
            classes.sectionTitle,
          )}
          containerClassName={classes.section}
        >
          <label
            className="p-form__label is-required"
            htmlFor="uploader_distribution"
          >
            Distribution
          </label>
          <div
            className={classNames(
              "u-no-margin--bottom",
              classes.derivedDistribution,
            )}
          >
            <span
              className={classes.derivedDistributionValue}
              id="uploader_distribution"
            >
              {formik.values.uploader_distribution}
            </span>
            <Icon name="lock-locked" aria-hidden />
          </div>

          <Select
            label="Components"
            required
            disabled={!formik.values.source}
            options={componentOptions}
            error={getFormikError(formik, "uploader_components")}
            {...formik.getFieldProps("uploader_components")}
          />

          <Select
            label="Architectures"
            required
            disabled={!formik.values.source}
            options={architectureOptions}
            error={getFormikError(formik, "uploader_architectures")}
            {...formik.getFieldProps("uploader_architectures")}
            className="u-no-margin--bottom"
          />
        </Blocks.Item>

        <Blocks.Item
          title="Settings"
          titleClassName={classNames(
            classes.sectionTitle,
            "p-text--small-caps",
          )}
          containerClassName={classes.section}
        >
          <Input
            type="checkbox"
            label={
              <span>
                <span className={classes.settingLabel}>
                  Hash based indexing
                </span>
                <Tooltip
                  message={SETTINGS_HELP_TEXT.hashIndexing}
                  position="top-center"
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            checked={formik.values.hash_indexing}
            {...formik.getFieldProps("hash_indexing")}
          />

          <Input
            type="checkbox"
            label={
              <span>
                <span className={classes.settingLabel}>
                  Automatic installation
                </span>
                <Tooltip
                  message={SETTINGS_HELP_TEXT.automaticInstallation}
                  position="top-center"
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            checked={formik.values.automatic_installation}
            {...formik.getFieldProps("automatic_installation")}
          />

          <Input
            type="checkbox"
            label={
              <span>
                <span className={classes.settingLabel}>Automatic upgrades</span>
                <Tooltip
                  message={SETTINGS_HELP_TEXT.automaticUpgrades}
                  position="top-center"
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            checked={formik.values.automatic_upgrades}
            {...formik.getFieldProps("automatic_upgrades")}
          />

          <Input
            type="checkbox"
            label="Skip bz2"
            checked={formik.values.skip_bz2}
            {...formik.getFieldProps("skip_bz2")}
          />

          <Input
            type="checkbox"
            label="Skip content indexing"
            checked={formik.values.skip_content_indexing}
            {...formik.getFieldProps("skip_content_indexing")}
          />
        </Blocks.Item>
      </Blocks>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add publication"
      />
    </Form>
  );
};

export default AddPublicationForm;
