import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Select, Icon } from "@canonical/react-components";
import { useFormik } from "formik";
import { useState, type FC } from "react";
import useNotify from "@/hooks/useNotify";
import type { SelectOption } from "@/types/SelectOption";
import {
  PublicationSettingsBlock,
  usePublishPublication,
  VALIDATION_SCHEMA_EXISTING,
} from "@/features/publications";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import PublishMirrorContentsBlock from "../PublishMirrorContentsBlock";
import type {
  Mirror,
  Publication,
  PublicationTarget,
} from "@canonical/landscape-openapi";
import {
  useGetOperation,
  useCancelOperation,
  useCanCancelOperations,
} from "@/features/operations";
import classes from "./PublishMirrorExistingForm.module.scss";

interface PublishMirrorExistingFormProps {
  readonly mirror: Mirror;
  readonly publications: Publication[];
  readonly publicationTargets: PublicationTarget[];
}

const PublishMirrorExistingForm: FC<PublishMirrorExistingFormProps> = ({
  mirror,
  publications,
  publicationTargets,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();

  const { publishPublication, isPublishingPublication } =
    usePublishPublication();
  const { cancelOperation } = useCancelOperation();
  const canCancelOperations = useCanCancelOperations();

  const [publication, setPublication] = useState<Publication | undefined>(
    publications[0],
  );
  const { operation, isGettingOperation } = useGetOperation(
    publication?.lastOperation ?? "",
  );
  const isInProgress = !!operation && !operation.done;

  const formik = useFormik({
    initialValues: { name: publications[0]?.name ?? "" },

    onSubmit: async (values) => {
      try {
        if (isInProgress) {
          if (!canCancelOperations) return;

          try {
            await cancelOperation(operation.name);
          } catch {
            // Ignore cancelation failures and try to publish anyway
          }
        }
        await publishPublication({ name: values.name });

        closeSidePanel();

        notify.success({
          title: `You have marked ${mirror.displayName} to be published`,
          message:
            "An activity has been queued to publish the selected publication to the designated target.",
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

  // This should never happen because this form is only enabled when there are
  // publications, but handling it reduces the cyclomatic complexity.
  if (!publication) {
    throw new Error("Selected publication not found");
  }

  const helpText = isGettingOperation ? (
    <span>
      <Icon
        name="spinner--muted"
        className={`${classes.loadingIcon} u-animation--spin`}
      />{" "}
      Checking publication status... please wait.
    </span>
  ) : undefined;

  const warning =
    canCancelOperations && isInProgress
      ? "This publication is already being published. If you proceed and this is not yet complete, the ongoing publication will be canceled and restarted."
      : undefined;

  const getErrors = () => {
    if (formik.touched.name && isInProgress && !canCancelOperations) {
      return "The selected publication is already being published. You must wait for this action to be completed to republish it.";
    }
    return getFormikError(formik, "name");
  };

  const targetDisplayName = publicationTargets.find(
    ({ name }) => name === publication.publicationTarget,
  )?.displayName;

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Select
            label="Publication"
            required
            options={publicationOptions}
            error={getErrors()}
            caution={warning}
            help={helpText}
            {...formik.getFieldProps("name")}
            onChange={(event) => {
              formik.handleChange(event);
              setPublication(
                publications.find(({ name }) => name === event.target.value),
              );
            }}
          />

          <ReadOnlyField
            label="Publication target"
            value={targetDisplayName ?? publication.publicationTarget}
            tooltipMessage="The publication target is defined by the publication."
          />

          <ReadOnlyField
            label="Signing GPG key"
            value={publication.gpgKey?.armor}
            tooltipMessage="The GPG key is defined by the publication."
          />
        </Blocks.Item>

        <PublishMirrorContentsBlock mirror={mirror} publication={publication} />

        <PublicationSettingsBlock publication={publication} />
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting || isPublishingPublication}
        submitButtonDisabled={isGettingOperation}
        submitButtonText="Publish mirror"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PublishMirrorExistingForm;
