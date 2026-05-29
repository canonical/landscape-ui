import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import useNotify from "@/hooks/useNotify";
import type { SelectOption } from "@/types/SelectOption";
import {
  PublicationSettingsBlock,
  usePublishPublication,
  VALIDATION_SCHEMA_EXISTING,
} from "@/features/publications";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import PublishMirrorContentsBlock from "../PublishMirrorContentsBlock";
import type { Mirror, Publication } from "@canonical/landscape-openapi";

interface PublishMirrorExistingFormProps {
  readonly mirror: Mirror;
  readonly publications: Publication[];
}

const PublishMirrorExistingForm: FC<PublishMirrorExistingFormProps> = ({
  mirror,
  publications,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();

  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const formik = useFormik({
    initialValues: { name: publications[0]?.name ?? "" },

    onSubmit: async (values) => {
      try {
        await publishPublication({
          publicationName: values.name,
          body: { forceOverwrite: true },
        });

        closeSidePanel();

        notify.success({
          title: `You have marked ${mirror.displayName} to be published.`,
          message:
            "An activity has been queued to publish it to the designated target.",
        });
      } catch (error) {
        debug(error);
      }
    },

    validationSchema: VALIDATION_SCHEMA_EXISTING,
    validateOnMount: true,
  });

  const publicationOptions: SelectOption[] = publications.map(
    ({ displayName, name }) => ({
      label: displayName,
      value: name ?? "",
      disabled: !name,
    }),
  );

  const publication = publications.find(
    ({ name }) => name === formik.values.name,
  );

  // This should never happen because this form is only enabled when there are
  // publications, but handling it reduces the cyclomatic complexity.
  if (!publication) {
    throw new Error("Selected publication not found");
  }

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Select
            label="Publication"
            required
            options={publicationOptions}
            error={getFormikError(formik, "name")}
            {...formik.getFieldProps("name")}
          />

          <ReadOnlyField
            label="Publication target"
            value={publication.publicationTarget}
            tooltipMessage="The publication target is defined by the publication."
          />

          <ReadOnlyField
            label="Signing GPG key"
            value={publication.gpgKey?.armor}
            tooltipMessage="The GPG key is defined by the publication."
          />
        </Blocks.Item>

        <PublishMirrorContentsBlock mirror={mirror} />

        <PublicationSettingsBlock publication={publication} />
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting || isPublishingPublication}
        submitButtonText="Publish mirror"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishMirrorExistingForm;
