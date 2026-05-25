import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { SETTINGS_HELP_TEXT } from "../../constants";
import useNotify from "@/hooks/useNotify";
import type { SelectOption } from "@/types/SelectOption";
import { usePublishPublication } from "@/features/publications";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import PublishMirrorContentsBlock from "../PublishMirrorContentsBlock";
import type { Mirror, Publication } from "@canonical/landscape-openapi";
import * as Yup from "yup";

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
    initialValues: { publicationName: publications[0]?.name ?? "" },

    onSubmit: async (values) => {
      try {
        await publishPublication({
          publicationName: values.publicationName,
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

    validationSchema: Yup.object().shape({
      publicationName: Yup.string().required("This field is required."),
    }),
  });

  const publicationOptions: SelectOption[] = publications.map(
    ({ displayName, name }) => ({
      label: displayName,
      value: name ?? "",
      disabled: !name,
    }),
  );

  const publication = publications.find(
    ({ name }) => name === formik.values.publicationName,
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Select
            label="Publication"
            required
            options={publicationOptions}
            error={getFormikError(formik, "publicationName")}
            {...formik.getFieldProps("publicationName")}
          />

          <ReadOnlyField
            label="Publication target"
            value={publication?.publicationTarget}
            tooltipMessage={
              "The publication target is defined by the publication."
            }
          />

          <ReadOnlyField
            label="Signing GPG key"
            value={publication?.gpgKey?.armor}
            tooltipMessage={"The GPG key is defined by the publication."}
          />
        </Blocks.Item>

        <PublishMirrorContentsBlock mirror={mirror} />

        <Blocks.Item title="Settings">
          <CheckboxInputWithHelp
            label="Hash based indexing"
            tooltipMessage={SETTINGS_HELP_TEXT.hashIndexing}
            checked={publication?.acquireByHash ?? false}
            disabled
          />

          <CheckboxInputWithHelp
            label="Automatic installation"
            tooltipMessage={SETTINGS_HELP_TEXT.automaticInstallation}
            checked={!publication?.notAutomatic}
            disabled
          />

          <CheckboxInputWithHelp
            label="Automatic upgrades"
            tooltipMessage={SETTINGS_HELP_TEXT.automaticUpgrades}
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
        submitButtonDisabled={!formik.isValid}
        submitButtonLoading={formik.isSubmitting || isPublishingPublication}
        submitButtonText="Publish mirror"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishMirrorExistingForm;
