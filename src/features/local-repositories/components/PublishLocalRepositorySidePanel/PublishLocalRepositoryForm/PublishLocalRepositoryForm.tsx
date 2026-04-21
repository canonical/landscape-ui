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
  type PublishLocalRepositoryFormValues,
  SETTINGS_HELP_TEXT,
  VALIDATION_SCHEMA,
} from "../constants";
import useNotify from "@/hooks/useNotify";
import { usePublishLocalRepository } from "../../../api/usePublishLocalRepository";
import classNames from "classnames";
import classes from "./PublishLocalRepositoryForm.module.scss";
import type { SelectOption } from "@/types/SelectOption";
import useGetPublicationTargets from "../../../api/useGetPublicationTargets";
import RadioGroup from "@/components/form/RadioGroup";
import useGetPublications from "../../../api/useGetPublications";
import type { LocalRepository } from "../../../types";

interface PublishLocalRepositoryFormProps {
  readonly repository: LocalRepository;
}

const PublishLocalRepositoryForm: FC<PublishLocalRepositoryFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { publications, isGettingPublications } = useGetPublications();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { publishRepository, isPublishingRepository } =
    usePublishLocalRepository();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    repository: "",
  });

  const initialValues: PublishLocalRepositoryFormValues = {
    new_publication: true,
    name: "",
    publication_target: "",
    prefix: "",
    distribution: repository.distribution,
    component: repository.component,
    architectures: "",
    mirror_signing_key: "",
    hash_indexing: false,
    automatic_installation: false,
    automatic_upgrades: false,
    skip_bz2: false,
    skip_content_indexing: false,
  };

  const handleSubmit = async (values: PublishLocalRepositoryFormValues) => {
    const valuesforCreation = {
      name: values.name,
      publication_target: values.publication_target,
      prefix: values.prefix,
      distribution: values.distribution,
      components: values.component,
      architectures: values.architectures,
      mirror_signing_key: values.mirror_signing_key,
      hash_indexing: values.hash_indexing,
      automatic_installation: values.automatic_installation,
      automatic_upgrades: values.automatic_upgrades,
      skip_bz2: values.skip_bz2,
      skip_content_indexing: values.skip_content_indexing,
    };

    try {
      await publishRepository(valuesforCreation);

      closeSidePanel();

      notify.success({
        title: "Local repository added",
        message: `The local repository "${values.name}" has been added successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
    validateOnMount: true,
  });

  const publicationOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication", value: "" },
      ...publications.map((publication) => ({
        label: publication.label,
        value: publication.publicationId,
      })),
    ],
    [publications],
  );

  const publicationTargetOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Select publication target", value: "" },
      ...publicationTargets.map((publicationTarget) => ({
        label: publicationTarget.displayName,
        value: publicationTarget.publication_target_id,
      })),
    ],
    [publicationTargets],
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <RadioGroup
            label="Publish to"
            formik={formik}
            field="new_publication"
            inputs={[
              {
                key: "new",
                value: true,
                label: "New publication",
              },
              {
                key: "existing",
                value: false,
                label: "Existing publication",
              },
            ]}
            labelHeading={false}
            sideByside
          />

          {formik.values.new_publication ? (
            <Input
              type="text"
              label="Publication name"
              required
              error={getFormikError(formik, "name")}
              {...formik.getFieldProps("name")}
            />
          ) : (
            <Select
              label="Publication name"
              required
              disabled={isGettingPublications}
              options={publicationOptions}
              error={getFormikError(formik, "name")}
              {...formik.getFieldProps("name")}
            />
          )}

          <Select
            label="Publication target"
            required
            disabled={isGettingPublicationTargets}
            options={publicationTargetOptions}
            error={getFormikError(formik, "publication_target")}
            {...formik.getFieldProps("publication_target")}
          />

          <Input
            type="text"
            label="Directory prefix"
            error={getFormikError(formik, "prefix")}
            {...formik.getFieldProps("prefix")}
          />

          <Textarea
            label="Signing GPG key"
            rows={4}
            error={getFormikError(formik, "mirror_signing_key")}
            {...formik.getFieldProps("mirror_signing_key")}
            className="u-no-margin--bottom"
          />
        </Blocks.Item>

        <Blocks.Item title="Contents">
          <label className="p-form__label is-required" htmlFor="distribution">
            Distribution
          </label>
          <div
            className={classNames("u-no-margin--bottom", classes.distribution)}
          >
            <span className="u-text--muted" id="distribution">
              {formik.values.distribution}
            </span>
            <Icon name="lock-locked" aria-hidden />
          </div>

          <label className="p-form__label is-required" htmlFor="component">
            Component
          </label>
          <div
            className={classNames("u-no-margin--bottom", classes.distribution)}
          >
            <span className="u-text--muted" id="component">
              {formik.values.component}
            </span>
            <Icon name="lock-locked" aria-hidden />
          </div>
        </Blocks.Item>

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
        submitButtonLoading={formik.isSubmitting || isPublishingRepository}
        submitButtonText="Publish repository"
        onCancel={closeSidePanel}
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
      />
    </Form>
  );
};

export default PublishLocalRepositoryForm;
