import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import { useMemo, type FC } from "react";
import useNotify from "@/hooks/useNotify";
import type { SelectOption } from "@/types/SelectOption";
import { useGetPublicationTargets } from "@/features/publication-targets";
import type { Local } from "@canonical/landscape-openapi";
import {
  PublicationSettingsBlock,
  useCreatePublication,
  usePublishPublication,
  VALIDATION_SCHEMA_NEW,
} from "@/features/publications";
import PublishRepositoryContentsBlock from "../PublishRepositoryContentsBlock";
import type { PublishNewFormValues } from "@/features/publications";

interface PublishRepositoryNewFormProps {
  readonly repository: Local;
}

const PublishRepositoryNewForm: FC<PublishRepositoryNewFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { createPublication, isCreatingPublication } = useCreatePublication();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const handleSubmit = async (values: PublishNewFormValues) => {
    const valuesforCreation = {
      displayName: values.name,
      publicationTarget: values.publicationTarget,
      source: repository.name ?? "",
      distribution: repository.defaultDistribution,
      acquireByHash: values.hashIndexing,
      butAutomaticUpgrades: values.automaticUpgrades,
      notAutomatic: values.limitAutomaticInstallation,
      skipBz2: values.skipBz2,
      skipContents: values.skipContentIndexing,
      ...(values.signingKey && { gpgKey: { armor: values.signingKey } }),
    };

    try {
      const { data: publication } = await createPublication({
        body: valuesforCreation,
      });

      await publishPublication({ name: publication.name ?? "" });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository.displayName} to be published`,
        message:
          "A publication has been created and an activity has been queued to publish it to the designated target.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const publicationTargetOptions = useMemo<SelectOption[]>(
    () => [
      ...publicationTargets.map((publicationTarget) => ({
        label: publicationTarget.displayName,
        value: publicationTarget.name ?? "", // TODO change when API is fixed to return the name as non undefined
      })),
    ],
    [publicationTargets],
  );

  const initialValues: PublishNewFormValues = {
    name: "",
    publicationTarget: publicationTargetOptions[0]?.value || "",
    signingKey: "",
    hashIndexing: false,
    automaticUpgrades: false,
    limitAutomaticInstallation: false,
    skipBz2: false,
    skipContentIndexing: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_NEW,
    validateOnMount: true,
  });

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
            disabled={isGettingPublicationTargets}
            options={publicationTargetOptions}
            error={getFormikError(formik, "publicationTarget")}
            {...formik.getFieldProps("publicationTarget")}
          />

          <Textarea
            label="Signing GPG key"
            rows={4}
            error={getFormikError(formik, "signingKey")}
            {...formik.getFieldProps("signingKey")}
          />
        </Blocks.Item>

        <PublishRepositoryContentsBlock repository={repository} />

        <PublicationSettingsBlock formik={formik} />
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={
          formik.isSubmitting ||
          isCreatingPublication ||
          isPublishingPublication
        }
        submitButtonText="Publish repository"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishRepositoryNewForm;
