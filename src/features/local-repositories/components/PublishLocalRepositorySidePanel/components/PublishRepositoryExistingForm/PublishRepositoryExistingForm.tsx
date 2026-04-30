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
import type { Local, Publication } from "@canonical/landscape-openapi";
import { usePublishPublication } from "@/features/publications";
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
  const { popSidePath, createPageParamsSetter } = usePageParams();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    name: "",
  });

  const handleSubmit = async (values: { name: string }) => {
    try {
      await publishPublication({
        publicationName: values.name,
        body: { forceOverwrite: true, forceCleanup: true },
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
      <Blocks dense>
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
                  message={SETTINGS_HELP_TEXT.acquireByHash}
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
                  message={SETTINGS_HELP_TEXT.notAutomatic}
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
                  message={SETTINGS_HELP_TEXT.butAutomaticUpgrades}
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
        submitButtonLoading={formik.isSubmitting || isPublishingPublication}
        submitButtonText="Publish repository"
        onCancel={popSidePath}
      />
    </Form>
  );
};

export default PublishRepositoryExistingForm;
