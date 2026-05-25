import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { useMemo, type FC } from "react";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import { VALIDATION_SCHEMA_EXISTING } from "../../constants";
import useNotify from "@/hooks/useNotify";
import type { SelectOption } from "@/types/SelectOption";
import type { Local, Publication } from "@canonical/landscape-openapi";
import {
  PUBLICATION_SETTINGS_HELP_TEXT,
  usePublishPublication,
} from "@/features/publications";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import PublishRepositoryContentsBlock from "../PublishRepositoryContentsBlock";

interface PublishRepositoryExistingFormProps {
  readonly repository: Local;
  readonly publications: Publication[];
}

const PublishRepositoryExistingForm: FC<PublishRepositoryExistingFormProps> = ({
  repository,
  publications,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const handleSubmit = async (values: { name: string }) => {
    try {
      await publishPublication({
        publicationName: values.name,
        body: { forceOverwrite: true },
      });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository.displayName} to be published`,
        message:
          "An activity has been queued to publish the selected publication to the designated target.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const publicationOptions = useMemo<SelectOption[]>(
    () => [
      ...publications.map((publication) => ({
        label: publication.displayName,
        value: publication.name || "", // TODO change after fixing the API to return the publication name not undefined
      })),
    ],
    [publications],
  );

  const formik = useFormik({
    initialValues: { name: publicationOptions[0]?.value || "" },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_EXISTING,
    validateOnMount: true,
  });

  const publication = publications.find(
    ({ name }) => name === formik.values.name,
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Select
            label="Publication name"
            required
            options={publicationOptions}
            error={getFormikError(formik, "name")}
            {...formik.getFieldProps("name")}
          />

          <ReadOnlyField
            label="Publication target"
            value={publication?.publicationTarget ?? ""}
            tooltipMessage={
              "The publication target is defined by the publication."
            }
          />

          <ReadOnlyField
            label="Signing GPG key"
            value={publication?.gpgKey?.armor ?? ""}
            tooltipMessage={"The GPG key is defined by the publication."}
          />
        </Blocks.Item>

        <PublishRepositoryContentsBlock repository={repository} />

        <Blocks.Item title="Settings">
          <CheckboxInputWithHelp
            label="Hash based indexing"
            tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.hashIndexing}
            checked={publication?.acquireByHash ?? false}
            disabled
          />

          <CheckboxInputWithHelp
            label="Automatic installation"
            tooltipMessage={
              PUBLICATION_SETTINGS_HELP_TEXT.automaticInstallation
            }
            checked={publication?.notAutomatic ?? false}
            disabled
          />

          <CheckboxInputWithHelp
            label="Automatic upgrades"
            tooltipMessage={PUBLICATION_SETTINGS_HELP_TEXT.automaticUpgrades}
            checked={publication?.butAutomaticUpgrades ?? false}
            disabled
          />

          <Input
            type="checkbox"
            label="Skip bz2"
            checked={publication?.skipBz2 ?? false}
            disabled
          />

          <Input
            type="checkbox"
            label="Skip content indexing"
            checked={publication?.skipContents ?? false}
            disabled
          />
        </Blocks.Item>
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting || isPublishingPublication}
        submitButtonText="Publish repository"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishRepositoryExistingForm;
