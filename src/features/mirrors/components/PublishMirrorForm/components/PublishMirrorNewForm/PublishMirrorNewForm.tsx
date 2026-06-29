import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  Form,
  Input,
  type MultiSelectItem,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import useNotify from "@/hooks/useNotify";
import {
  getInitialValues,
  getInstallsAndUpgradesValues,
  PublicationSettingsBlock,
  useCreatePublication,
  usePublishPublication,
  VALIDATION_SCHEMA_NEW_MIRROR,
} from "@/features/publications";
import type { Mirror, PublicationTarget } from "@canonical/landscape-openapi";
import type { SelectOption } from "@/types/SelectOption";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import type { PublishNewFormValues } from "@/features/publications";
import MultiSelectField from "@/components/form/MultiSelectField/MultiSelectField";

interface PublishMirrorNewFormProps {
  readonly mirror: Mirror;
  readonly publicationTargets: PublicationTarget[];
}

const PublishMirrorNewForm: FC<PublishMirrorNewFormProps> = ({
  mirror,
  publicationTargets,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();

  const { createPublication, isCreatingPublication } = useCreatePublication();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const formik = useFormik({
    initialValues: {
      ...getInitialValues(publicationTargets[0]?.name),
      distribution: mirror.distribution,
      architectures: mirror.architectures,
    },

    onSubmit: async (values: PublishNewFormValues) => {
      const { notAutomatic, butAutomaticUpgrades } =
        getInstallsAndUpgradesValues(values.installsAndUpgrades);

      try {
        const { data: publication } = await createPublication({
          body: {
            displayName: values.name,
            publicationTarget: values.publicationTarget,
            source: mirror.name ?? "",
            distribution: values.distribution,
            architectures: values.architectures,
            acquireByHash: values.hashIndexing,
            notAutomatic,
            butAutomaticUpgrades,
            skipBz2: values.skipBz2,
            skipContents: values.skipContentIndexing,
            gpgKey: values.signingKey
              ? {
                  armor: values.signingKey,
                }
              : undefined,
          },
        });

        await publishPublication({ name: publication.name ?? "" });

        closeSidePanel();

        notify.success({
          title: `You have marked ${mirror.displayName} to be published`,
          message:
            "A publication has been created and an activity has been queued to publish it to the designated target.",
        });
      } catch (error) {
        debug(error);
      }
    },

    validationSchema: VALIDATION_SCHEMA_NEW_MIRROR,
    validateOnMount: true,
  });

  const publicationTargetOptions: SelectOption[] = publicationTargets.map(
    ({ displayName, name }) => ({
      label: displayName,
      value: name ?? "",
      disabled: !name,
    }),
  );

  const architectureOptions =
    mirror.architectures?.map((architecture) => ({
      label: architecture,
      value: architecture,
    })) ?? [];

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
    <Form onSubmit={formik.handleSubmit} noValidate>
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
            label="Publication target"
            required
            options={publicationTargetOptions}
            error={getFormikError(formik, "publicationTarget")}
            {...formik.getFieldProps("publicationTarget")}
          />

          {mirror.preserveSignatures ? (
            <ReadOnlyField
              label="Signing GPG key"
              value=""
              tooltipMessage="This mirror is preserving the upstream signing key"
            />
          ) : (
            <Textarea
              label="Signing GPG key"
              rows={4}
              error={getFormikError(formik, "signingKey")}
              {...formik.getFieldProps("signingKey")}
              className="u-no-margin--bottom"
            />
          )}
        </Blocks.Item>

        <Blocks.Item title="Contents">
          {mirror.preserveSignatures ? (
            <ReadOnlyField
              label="Distribution"
              value={formik.values.distribution ?? ""}
              tooltipMessage="You can't change the distribution of a signature-preserving mirror."
            />
          ) : (
            <Input
              type="text"
              label="Distribution"
              required
              {...formik.getFieldProps("distribution")}
            />
          )}
          <ReadOnlyField
            label="Components"
            value={mirror.components.join(", ")}
            tooltipMessage="The components are defined by the mirror."
          />
          <MultiSelectField
            variant="condensed"
            hasSelectedItemsFirst={false}
            label="Architectures"
            required
            items={architectureOptions}
            selectedItems={architectureOptions.filter(({ value }) =>
              formik.values.architectures?.includes(value),
            )}
            onItemsUpdate={handleArchitectureChange}
            error={getFormikError(formik, "architectures")}
          />
        </Blocks.Item>

        <PublicationSettingsBlock formik={formik} />
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={
          formik.isSubmitting ||
          isCreatingPublication ||
          isPublishingPublication
        }
        submitButtonText="Publish mirror"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishMirrorNewForm;
