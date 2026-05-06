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
import type { Local } from "@canonical/landscape-openapi";
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
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { createPublication, isCreatingPublication } = useCreatePublication();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const handleSubmit = async (values: PublishRepositoryNewFormValues) => {
    const valuesforCreation = {
      displayName: values.name,
      publicationTarget: values.publicationTarget,
      source: repository.name ?? "",
      distribution: repository.defaultDistribution,
      acquireByHash: values.acquireByHash,
      butAutomaticUpgrades: values.butAutomaticUpgrades,
      notAutomatic: values.notAutomatic,
      skipBz2: values.skipBz2,
      skipContents: values.skipContents,
      ...(values.gpgKey && { gpgKey: { armor: values.gpgKey } }),
    };

    try {
      const { data: publication } = await createPublication({
        body: valuesforCreation,
      });

      await publishPublication({
        publicationName: publication.name ?? "", // TODO change to use non-null assertion after fixing the API to return the publication name in the response
        body: { forceOverwrite: true, forceCleanup: true },
      });

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

  const initialValues: PublishRepositoryNewFormValues = {
    name: "",
    publicationTarget: publicationTargetOptions[0]?.value || "",
    gpgKey: "",
    acquireByHash: false,
    butAutomaticUpgrades: false,
    notAutomatic: false,
    skipBz2: false,
    skipContents: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_NEW,
    validateOnMount: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks dense>
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
            error={getFormikError(formik, "gpgKey")}
            {...formik.getFieldProps("gpgKey")}
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
                  message={SETTINGS_HELP_TEXT.acquireByHash}
                  position="top-center"
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            checked={formik.values.acquireByHash}
            {...formik.getFieldProps("acquireByHash")}
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
            checked={formik.values.notAutomatic}
            {...formik.getFieldProps("notAutomatic")}
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
            checked={formik.values.butAutomaticUpgrades}
            {...formik.getFieldProps("butAutomaticUpgrades")}
          />

          <Input
            type="checkbox"
            label="Skip bz2"
            checked={formik.values.skipBz2}
            {...formik.getFieldProps("skipBz2")}
          />

          <Input
            type="checkbox"
            label="Skip content indexing"
            checked={formik.values.skipContents}
            {...formik.getFieldProps("skipContents")}
          />
        </Blocks.Item>
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
