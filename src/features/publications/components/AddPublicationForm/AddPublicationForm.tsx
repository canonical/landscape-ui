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
  Input,
  Select,
  Textarea,
  type MultiSelectItem,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo } from "react";
import { useCreatePublication } from "../../api";
import {
  INITIAL_VALUES,
  SOURCE_TYPE_LOCAL_REPOSITORY,
  SOURCE_TYPE_MIRROR,
  SOURCE_TYPE_OPTIONS,
  VALIDATION_SCHEMA,
} from "./constants";
import { getPublicationPayload, stripResourcePrefix } from "./helpers";
import type { FormProps, SelectableSource } from "./types";
import PublicationSettingsBlock from "../../components/PublicationSettingsBlock";

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
        components: mirror.components,
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
        components: [localSource.defaultComponent],
        architectures: [],
      })),
    [locals],
  );

  const selectableSources = useMemo(() => {
    if (formik.values.sourceType === SOURCE_TYPE_MIRROR) {
      return mirrorSources;
    }

    if (formik.values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY) {
      return localSources;
    }

    return [];
  }, [formik.values.sourceType, localSources, mirrorSources]);

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
    formik.values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY;

  const isGettingSources =
    formik.values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY &&
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
    await formik.setFieldValue("sourceType", event.target.value);
    await formik.setFieldValue("source", "");
    await formik.setFieldValue("distribution", "");
    await formik.setFieldValue("architectures", []);
    await formik.setFieldValue("signingKey", "");
  };

  const handleSourceChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const sourceValue = event.target.value;
    const source = selectableSources.find(({ value }) => value === sourceValue);

    await formik.setFieldValue("source", sourceValue);
    await formik.setFieldValue("distribution", source?.distribution ?? "");

    if (source?.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY) {
      await formik.setFieldValue("architectures", []);
      await formik.setFieldValue("signingKey", "");

      return;
    }
    await formik.setFieldValue("architectures", []);
    await formik.setFieldValue("signingKey", "");
  };

  const handleArchitectureChange = async (
    items: MultiSelectItem[],
  ): Promise<void> => {
    await formik.setFieldTouched("architectures", true);
    await formik.setFieldValue(
      "architectures",
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
            error={getFormikError(formik, "sourceType")}
            {...formik.getFieldProps("sourceType")}
            onChange={handleSourceTypeChange}
          />

          <Select
            label="Source"
            required
            disabled={!formik.values.sourceType || isGettingSources}
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
            error={getFormikError(formik, "publicationTarget")}
            {...formik.getFieldProps("publicationTarget")}
          />

          {selectedSource?.sourceType === SOURCE_TYPE_MIRROR &&
            selectedSource.preserveSignatures === false && (
              <Textarea
                label="Signing GPG key"
                rows={4}
                {...formik.getFieldProps("signingKey")}
                error={getFormikError(formik, "signingKey")}
              />
            )}
        </Blocks.Item>

        <Blocks.Item title="Contents">
          {isLocalSourceType || selectedSource?.preserveSignatures ? (
            <ReadOnlyField
              label="Distribution"
              value={formik.values.distribution}
              tooltipMessage="The distribution is defined by the selected source."
            />
          ) : (
            <Input
              type="text"
              label="Distribution"
              required
              error={getFormikError(formik, "distribution")}
              {...formik.getFieldProps("distribution")}
            />
          )}

          <ReadOnlyField
            label={isLocalSourceType ? "Component" : "Components"}
            value={selectedSource?.components?.join(", ")}
            tooltipMessage={`The ${isLocalSourceType ? "component is" : "components are"} defined by the selected source.`}
          />

          {!isLocalSourceType && (
            <MultiSelectField
              variant="condensed"
              hasSelectedItemsFirst={false}
              label="Architectures"
              required
              disabled={!formik.values.source}
              items={architectureItems}
              selectedItems={architectureItems.filter(({ value }) =>
                formik.values.architectures.includes(value),
              )}
              onItemsUpdate={handleArchitectureChange}
              error={getFormikError(formik, "architectures")}
            />
          )}
        </Blocks.Item>

        <PublicationSettingsBlock formik={formik} />
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
