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
  Textarea,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import { useMemo, type FC } from "react";
import {
  type PublishRepositoryNewFormValues,
  SETTINGS_HELP_TEXT,
  VALIDATION_SCHEMA_NEW,
} from "../../constants";
import useNotify from "@/hooks/useNotify";
import classes from "../../PublishLocalRepositorySidePanel.module.scss";
import type { SelectOption } from "@/types/SelectOption";
import { useGetPublicationTargets } from "@/features/publication-targets";
import type { Local } from "../../../../types";
import {
  useCreatePublication,
  usePublishPublication,
} from "@/features/publications";
import PublishRepositoryContentsBlock from "../PublishRepositoryContentsBlock";

interface PublishRepositoryNewFormProps {
  readonly repository: Local;
}

const PublishRepositoryNewForm: FC<PublishRepositoryNewFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { createPublication, isCreatingPublication } = useCreatePublication();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    name: "",
  });

  const initialValues: PublishRepositoryNewFormValues = {
    name: "",
    publication_target: "",
    signing_key: "",
    hash_indexing: false,
    automatic_installation: false,
    automatic_upgrades: false,
    skip_bz2: false,
    skip_content_indexing: false,
  };

  const handleSubmit = async (values: PublishRepositoryNewFormValues) => {
    try {
      const { data: publication } = await createPublication({
        body: {
          displayName: values.name,
          publicationTarget: values.publication_target,
          source: repository.name,
          distribution: repository.distribution,
          acquireByHash: values.hash_indexing,
          notAutomatic: !values.automatic_installation,
          butAutomaticUpgrades: values.automatic_upgrades,
          skipBz2: values.skip_bz2,
          skipContents: values.skip_content_indexing,
          gpgKey: values.signing_key
            ? { armor: values.signing_key }
            : undefined,
        },
      });

      await publishPublication({
        publicationName: publication.name ?? "", // TODO change to use non-null assertion after fixing the API to return the publication name in the response
        body: { forceOverwrite: true, forceCleanup: true },
      });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository.display_name} to be published`,
        message:
          "A publication has been created and an activity has been queued to publish it to the designated target.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_NEW,
    validateOnMount: true,
  });

  const publicationTargetOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication target", value: "" },
      ...publicationTargets.map((publicationTarget) => ({
        label: publicationTarget.displayName,
        value: publicationTarget.name ?? "", // TODO change when API is fixed to return the name as non undefined
      })),
    ],
    [publicationTargets],
  );

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
            error={getFormikError(formik, "publication_target")}
            {...formik.getFieldProps("publication_target")}
          />

          <Textarea
            label="Signing GPG key"
            rows={4}
            error={getFormikError(formik, "signing_key")}
            {...formik.getFieldProps("signing_key")}
            className="u-no-margin--bottom"
          />
        </Blocks.Item>

        <PublishRepositoryContentsBlock repository={repository} />

        <Blocks.Item title="Settings">
          <Input
            type="checkbox"
            label={
              <span>
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
              </span>
            }
            checked={formik.values.hash_indexing}
            {...formik.getFieldProps("hash_indexing")}
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
            checked={formik.values.automatic_installation}
            {...formik.getFieldProps("automatic_installation")}
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
            checked={formik.values.automatic_upgrades}
            {...formik.getFieldProps("automatic_upgrades")}
          />

          <Input
            type="checkbox"
            label="Skip bz2"
            checked={formik.values.skip_bz2}
            {...formik.getFieldProps("skip_bz2")}
          />

          <Input
            type="checkbox"
            label="Skip content indexing"
            checked={formik.values.skip_content_indexing}
            {...formik.getFieldProps("skip_content_indexing")}
          />
        </Blocks.Item>
      </Blocks>

      <SidePanelFormButtons
        submitButtonDisabled={!formik.isValid}
        submitButtonLoading={
          formik.isSubmitting ||
          isCreatingPublication ||
          isPublishingPublication
        }
        submitButtonText="Publish repository"
        onCancel={closeSidePanel}
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
      />
    </Form>
  );
};

export default PublishRepositoryNewForm;
