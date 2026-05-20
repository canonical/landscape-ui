import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import useNotify from "@/hooks/useNotify";
import {
  PublicationSettingsBlock,
  useCreatePublication,
  usePublishPublication,
} from "@/features/publications";
import PublishMirrorContentsBlock from "../PublishMirrorContentsBlock";
import type { Mirror, PublicationTarget } from "@canonical/landscape-openapi";
import type { SelectOption } from "@/types/SelectOption";
import * as Yup from "yup";
import ReadOnlyField from "@/components/form/ReadOnlyField";

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
      publicationName: "",
      publicationTarget: publicationTargets[0]?.name ?? "",
      signingKey: "",
      hashIndexing: false,
      limitAutomaticInstallation: false,
      automaticUpgrades: false,
      skipBz2: false,
      skipContentIndexing: false,
    },

    onSubmit: async (values) => {
      try {
        const { data: publication } = await createPublication({
          body: {
            displayName: values.publicationName,
            publicationTarget: values.publicationTarget,
            source: mirror.name ?? "",
            distribution: mirror.distribution,
            acquireByHash: values.hashIndexing,
            notAutomatic: values.limitAutomaticInstallation,
            butAutomaticUpgrades: values.automaticUpgrades,
            skipBz2: values.skipBz2,
            skipContents: values.skipContentIndexing,
            gpgKey: values.signingKey
              ? {
                  armor: values.signingKey,
                }
              : undefined,
          },
        });

        await publishPublication({
          publicationName: publication.name ?? "",
          body: { forceOverwrite: true },
        });

        closeSidePanel();

        notify.success({
          title: `You have marked ${mirror.displayName} to be published.`,
          message:
            "A publication has been created and an activity has been queued to publish it to the designated target.",
        });
      } catch (error) {
        debug(error);
      }
    },

    validationSchema: Yup.object().shape({
      publicationName: Yup.string().required("This field is required."),
      publicationTarget: Yup.string().required("This field is required."),
      signingKey: Yup.string(),
      hashIndexing: Yup.boolean(),
      limitAutomaticInstallation: Yup.boolean(),
      automaticUpgrades: Yup.boolean(),
      skipBz2: Yup.boolean(),
      skipContentIndexing: Yup.boolean(),
    }),
  });

  const publicationTargetOptions: SelectOption[] = publicationTargets.map(
    ({ displayName, name }) => ({
      label: displayName,
      value: name ?? "",
      disabled: !name,
    }),
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Input
            type="text"
            label="Publication name"
            required
            error={getFormikError(formik, "publicationName")}
            {...formik.getFieldProps("publicationName")}
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

        <PublishMirrorContentsBlock mirror={mirror} />

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
