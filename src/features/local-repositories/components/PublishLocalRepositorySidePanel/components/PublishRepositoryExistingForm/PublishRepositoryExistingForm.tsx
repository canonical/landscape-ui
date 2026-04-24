import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Blocks from "@/components/layout/Blocks";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  Form,
  Icon,
  Input,
  Select,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import { useMemo, type FC } from "react";
import {
  SETTINGS_HELP_TEXT,
  VALIDATION_SCHEMA_EXISTING,
} from "../../constants";
import useNotify from "@/hooks/useNotify";
import classes from "../../PublishLocalRepositorySidePanel.module.scss";
import type { SelectOption } from "@/types/SelectOption";
import type { Local } from "../../../../types";
import {
  type Publication,
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
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    repository: "",
  });

  const handleSubmit = async (values: { name: string }) => {
    try {
      await publishPublication({ name: values.name });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository.display_name} to be published`,
        message:
          "An activity has been queued to publish the selected publication to the designated target.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: { name: "" },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_EXISTING,
  });

  const publicationOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication", value: "" },
      ...publications.map((publication) => ({
        label: publication.displayName,
        value: publication.name,
      })),
    ],
    [publications],
  );

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
          <Input
            type="checkbox"
            label={
              <>
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
              </>
            }
            checked={publication?.acquireByHash ?? false}
            disabled
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
            checked={publication?.notAutomatic ?? false}
            disabled
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
        submitButtonText="Publish repository"
        onCancel={closeSidePanel}
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
      />
    </Form>
  );
};

export default PublishRepositoryExistingForm;
