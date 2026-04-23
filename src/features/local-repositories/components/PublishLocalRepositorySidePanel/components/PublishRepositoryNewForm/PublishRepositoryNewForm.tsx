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
import useGetPublicationTargets from "@/features/publication-targets";
import type { LocalRepository } from "../../../../types";
import { useAddPublication, usePublishPublication } from "@/features/publications";
import PublishRepositoryContentsBlock from "../PublishRepositoryContentsBlock";

interface PublishRepositoryNewFormProps {
  readonly repository: LocalRepository;
}

const PublishRepositoryNewForm: FC<PublishRepositoryNewFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { addPublication, isAddingPublication } = useAddPublication();
  const { publishPublication, isPublishingPublication } = usePublishPublication();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    repository: "",
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
    const valuesforCreation = {
      publication_target: values.publication_target,
      source: repository.name,
      distribution: repository.distribution,
      hash_indexing: values.hash_indexing,
      automatic_installation: values.automatic_installation,
      automatic_upgrades: values.automatic_upgrades,
      skip_bz2: values.skip_bz2,
      skip_content_indexing: values.skip_content_indexing,
      gpg_key: values.signing_key,
    };

    try {
      const { data: publication } = await addPublication(valuesforCreation);

      await publishPublication({ name: publication.name });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository.display_name} to be published`,
        message: "A publication has been created and an activity has been queued to publish it to the designated target.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA_NEW,
  });

  const publicationTargetOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication target", value: "" },
      ...publicationTargets.map((publicationTarget) => ({
        label: publicationTarget.displayName,
        value: publicationTarget.name,
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
        submitButtonLoading={formik.isSubmitting || isAddingPublication || isPublishingPublication}
        submitButtonText="Publish repository"
        onCancel={closeSidePanel}
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
      />
    </Form>
  );
};

export default PublishRepositoryNewForm;
