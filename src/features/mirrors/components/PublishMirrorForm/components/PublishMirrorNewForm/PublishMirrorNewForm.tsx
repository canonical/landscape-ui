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
import type { FC } from "react";
import { SETTINGS_HELP_TEXT } from "../../constants";
import useNotify from "@/hooks/useNotify";
import classes from "../../PublishMirrorForm.module.scss";
import {
  useCreatePublication,
  usePublishPublication,
} from "@/features/publications";
import PublishMirrorContentsBlock from "../PublishMirrorContentsBlock";
import type { Mirror, PublicationTarget } from "@canonical/landscape-openapi";
import type { SelectOption } from "@/types/SelectOption";
import * as Yup from "yup";

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
      automaticInstallation: false,
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
            notAutomatic: !values.automaticInstallation,
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
          body: { forceCleanup: true, forceOverwrite: true },
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
      automaticInstallation: Yup.boolean(),
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

          <Textarea
            label="Signing GPG key"
            rows={4}
            error={getFormikError(formik, "signingKey")}
            {...formik.getFieldProps("signingKey")}
            className="u-no-margin--bottom"
          />
        </Blocks.Item>

        <PublishMirrorContentsBlock mirror={mirror} />

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
            checked={formik.values.hashIndexing}
            {...formik.getFieldProps("hashIndexing")}
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
            checked={formik.values.automaticInstallation}
            {...formik.getFieldProps("automaticInstallation")}
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
            checked={formik.values.automaticUpgrades}
            {...formik.getFieldProps("automaticUpgrades")}
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
            checked={formik.values.skipContentIndexing}
            {...formik.getFieldProps("skipContentIndexing")}
          />
        </Blocks.Item>
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
