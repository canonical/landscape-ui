import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import MultiSelectField from "@/components/form/MultiSelectField";
import Blocks from "@/components/layout/Blocks";
import { useGetLocalRepositories } from "@/features/local-repositories";
import { useListMirrors } from "@/features/mirrors";
import { useGetPublicationTargets } from "@/features/publication-targets";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  Form,
  Icon,
  Input,
  Select,
  Textarea,
  Tooltip,
  type MultiSelectItem,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo } from "react";
import { useCreatePublication } from "../../api";
import classes from "./AddPublicationForm.module.scss";
import {
  INITIAL_VALUES,
  SETTINGS_HELP_TEXT,
  SOURCE_TYPE_LOCAL_REPOSITORY,
  SOURCE_TYPE_MIRROR,
  SOURCE_TYPE_OPTIONS,
} from "./constants";
import {
  getPublicationPayload,
  stripResourcePrefix,
  VALIDATION_SCHEMA,
} from "./helpers";
import type { FormProps, SelectableSource } from "./types";

const AddPublicationForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();
  const { data: mirrorsData } = useListMirrors();
  const { repositories: locals, isGettingRepositories: isGettingLocals } =
    useGetLocalRepositories();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { createPublication, isCreatingPublication } = useCreatePublication();

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        const payload = getPublicationPayload(values);
        await createPublication(payload);

        closeSidePanel();

        notify.success({
          title: "Publication created",
          message: `Publication "${values.name}" has been created.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const mirrors = useMemo(() => mirrorsData?.data.mirrors ?? [], [mirrorsData]);

  const mirrorSources = useMemo<SelectableSource[]>(
    () =>
      mirrors.map((mirror) => ({
        label: mirror.displayName,
        value: stripResourcePrefix(mirror.name, "mirrors/"),
        sourceType: SOURCE_TYPE_MIRROR,
        distribution: mirror.distribution,
        architectures: mirror.architectures ?? [],
        preserveSignatures: mirror.preserveSignatures,
      })),
    [mirrors],
  );

  const localSources = useMemo<SelectableSource[]>(
    () =>
      locals.map((localSource) => ({
        label: localSource.displayName,
        value: stripResourcePrefix(localSource.name, "locals/"),
        sourceType: SOURCE_TYPE_LOCAL_REPOSITORY,
        distribution: localSource.defaultDistribution,
        architectures: [],
      })),
    [locals],
  );

  const selectableSources = useMemo(() => {
    if (formik.values.source_type === SOURCE_TYPE_MIRROR) {
      return mirrorSources;
    }

    if (formik.values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY) {
      return localSources;
    }

    return [];
  }, [formik.values.source_type, localSources, mirrorSources]);

  const sourceOptions = useMemo(
    () => [
      { label: "Select source", value: "" },
      ...selectableSources.map(({ label, value }) => ({ label, value })),
    ],
    [selectableSources],
  );

  const selectedSource = selectableSources.find(
    ({ value }) => value === formik.values.source,
  );

  const isLocalSourceType =
    formik.values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY;

  const isGettingSources =
    formik.values.source_type === SOURCE_TYPE_LOCAL_REPOSITORY &&
    isGettingLocals;

  const publicationTargetOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication target", value: "" },
      ...publicationTargets.map((publicationTarget) => ({
        label: publicationTarget.displayName,
        value: stripResourcePrefix(
          publicationTarget.name,
          "publicationTargets/",
        ),
      })),
    ],
    [publicationTargets],
  );

  const architectureItems = useMemo(
    () =>
      (selectedSource?.architectures ?? []).map((architecture) => ({
        label: architecture,
        value: architecture,
      })),
    [selectedSource],
  );

  const handleSourceTypeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    await formik.setFieldValue("source_type", event.target.value);
    await formik.setFieldValue("source", "");
    await formik.setFieldValue("uploader_distribution", "");
    await formik.setFieldValue("uploader_architectures", []);
    await formik.setFieldValue("signing_key", "");
  };

  const handleSourceChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const sourceValue = event.target.value;
    const source = selectableSources.find(({ value }) => value === sourceValue);

    await formik.setFieldValue("source", sourceValue);
    await formik.setFieldValue(
      "uploader_distribution",
      source?.distribution ?? "",
    );

    if (source?.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY) {
      await formik.setFieldValue("uploader_architectures", []);
      await formik.setFieldValue("signing_key", "");

      return;
    }
    await formik.setFieldValue("uploader_architectures", []);
    await formik.setFieldValue("signing_key", "");
  };

  const handleArchitectureChange = async (
    items: MultiSelectItem[],
  ): Promise<void> => {
    await formik.setFieldTouched("uploader_architectures", true);
    await formik.setFieldValue(
      "uploader_architectures",
      items.map(({ value }) => String(value)),
    );
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Blocks>
        <Blocks.Item title="Details">
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
            disabled={!formik.values.source_type || isGettingSources}
            options={sourceOptions}
            error={getFormikError(formik, "source")}
            {...formik.getFieldProps("source")}
            onChange={handleSourceChange}
          />

          <Select
            label="Publication target"
            required
            disabled={isGettingPublicationTargets}
            options={publicationTargetOptions}
            error={getFormikError(formik, "publication_target")}
            {...formik.getFieldProps("publication_target")}
          />

          <Input
            type="text"
            label="Directory prefix"
            error={getFormikError(formik, "prefix")}
            {...formik.getFieldProps("prefix")}
          />
        </Blocks.Item>

        <Blocks.Item title="Contents">
          {isLocalSourceType || selectedSource?.preserveSignatures ? (
            <ReadOnlyField
              label="Distribution"
              required
              value={formik.values.uploader_distribution}
              tooltipMessage="The distribution is derived from the selected source."
            />
          ) : (
            <Input
              type="text"
              label="Distribution"
              required
              error={getFormikError(formik, "uploader_distribution")}
              {...formik.getFieldProps("uploader_distribution")}
            />
          )}

          {!isLocalSourceType && (
            <MultiSelectField
              variant="condensed"
              hasSelectedItemsFirst={false}
              label="Architectures"
              required
              disabled={!formik.values.source}
              items={architectureItems}
              selectedItems={architectureItems.filter(({ value }) =>
                formik.values.uploader_architectures.includes(value),
              )}
              onItemsUpdate={handleArchitectureChange}
              error={getFormikError(formik, "uploader_architectures")}
            />
          )}
        </Blocks.Item>

        {selectedSource?.sourceType === SOURCE_TYPE_MIRROR &&
          selectedSource.preserveSignatures === false && (
            <Blocks.Item title="Signing GPG Key">
              <Textarea
                {...formik.getFieldProps("signing_key")}
                error={getFormikError(formik, "signing_key")}
              />
            </Blocks.Item>
          )}

        <Blocks.Item title="Settings">
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
        submitButtonDisabled={formik.isSubmitting || isCreatingPublication}
        submitButtonText="Add publication"
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default AddPublicationForm;
