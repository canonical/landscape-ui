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
  Notification,
  Select,
  Textarea,
  type MultiSelectItem,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo } from "react";
import { useCreatePublication, usePublishPublication } from "../../api";
import {
  SOURCE_TYPE_LOCAL_REPOSITORY,
  SOURCE_TYPE_MIRROR,
  SOURCE_TYPE_OPTIONS,
  VALIDATION_SCHEMA,
} from "./constants";
import { getPublicationPayload, stripResourcePrefix } from "./helpers";
import type { FormProps, SelectableSource } from "./types";
import PublicationSettingsBlock from "../../components/PublicationSettingsBlock";
import { getInitialValues } from "../../helpers";

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
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const formik = useFormik<FormProps>({
    initialValues: {
      ...getInitialValues(),
      sourceType: SOURCE_TYPE_MIRROR,
      source: "",
      distribution: "",
      architectures: [],
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        const payload = getPublicationPayload(values);
        const { data: publication } = await createPublication(payload);
        await publishPublication({ name: publication.name ?? "" });

        closeSidePanel();

        notify.success({
          title: `You have successfully added ${values.name}`,
          message:
            "The publication has been created and marked to be published.",
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

  const isLocalSourceType =
    formik.values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY;

  const selectableSources = useMemo(() => {
    if (isLocalSourceType) {
      return localSources;
    }

    return mirrorSources;
  }, [isLocalSourceType, localSources, mirrorSources]);

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

  const isGettingSources = isLocalSourceType && isGettingLocals;

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
            disabled={isGettingSources}
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

          {!selectedSource?.preserveSignatures ? (
            <Textarea
              label="Signing GPG key"
              rows={4}
              {...formik.getFieldProps("signingKey")}
              error={getFormikError(formik, "signingKey")}
            />
          ) : (
            <Notification
              severity="information"
              borderless
              className="u-no-margin--bottom"
            >
              The selected source preserves the upstream signing key.
            </Notification>
          )}
        </Blocks.Item>

        <Blocks.Item title="Contents">
          {isLocalSourceType || selectedSource?.preserveSignatures ? (
            <ReadOnlyField
              label="Distribution"
              value={formik.values.distribution}
              tooltipMessage={
                isLocalSourceType
                  ? "The distribution is defined by the source repository."
                  : "The distribution can't be changed for signature-preserving mirrors."
              }
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
            tooltipMessage={
              isLocalSourceType
                ? "The component is defined by the source repository."
                : "The components are defined by the source mirror."
            }
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
        submitButtonLoading={
          formik.isSubmitting ||
          isCreatingPublication ||
          isPublishingPublication
        }
        submitButtonText="Add publication"
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default AddPublicationForm;
