import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import CheckboxInputWithHelp from "@/components/form/CheckboxInputWithHelp";
import { useGetMirror, useUpdateMirror } from "../../api";
import { useFormik } from "formik";
import type { FormProps } from "./types";
import Blocks from "@/components/layout/Blocks";
import { CheckboxInput, Form, Input } from "@canonical/react-components";
import GpgKeyField from "@/components/form/GpgKeyField";
import { getFormikError } from "@/utils/formikErrors";
import {
  getSourceType,
  shouldShowAuthentication,
} from "../MirrorDetails/helpers";
import { SETTINGS_HELP_TEXT } from "../../constants";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import * as Yup from "yup";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import classes from "./EditMirrorForm.module.scss";
import MirrorFilterHelpButton from "../MirrorFilterHelpButton";

const EditMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { name, popSidePathUntilClear, closeSidePanel } = usePageParams();

  const mirror = useGetMirror(name).data.data;
  const updateMirror = useUpdateMirror(name).mutateAsync;

  const formik = useFormik<FormProps>({
    initialValues: {
      name: mirror.displayName,
      preserveSignatures: !!mirror.preserveSignatures,
      downloadUdebPackages: !!mirror.downloadUdebs,
      downloadSources: !!mirror.downloadSources,
      downloadInstallerFiles: !!mirror.downloadInstaller,
      verificationGpgKey: mirror.gpgKey?.armor,
      packageFilter: mirror.filter,
      includeDependencies: !!mirror.filterWithDeps,
      keepCurrentGpgKey: !!mirror.gpgKey,
    },

    validationSchema: Yup.object().shape({
      name: Yup.string().required("This field is required."),
    }),

    onSubmit: async (values) => {
      try {
        await updateMirror({
          displayName: values.name,
          archiveRoot: mirror.archiveRoot,
          components: mirror.components,
          preserveSignatures: values.preserveSignatures,
          downloadUdebs: values.downloadUdebPackages,
          downloadSources: values.downloadSources,
          downloadInstaller: values.downloadInstallerFiles,
          ...(!values.keepCurrentGpgKey && {
            gpgKey: values.verificationGpgKey
              ? { armor: values.verificationGpgKey }
              : undefined,
          }),
          filter: values.packageFilter,
          filterWithDeps: values.packageFilter
            ? values.includeDependencies
            : undefined,
        });

        closeSidePanel();

        notify.success({
          title: `You have successfully edited ${values.name}`,
          message: "The mirror details have been updated.",
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <>
      <SidePanel.Header>Edit {mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Details">
              <Input
                type="text"
                label="Name"
                required
                {...formik.getFieldProps("name")}
                error={getFormikError(formik, "name")}
              />
              <ReadOnlyField
                label="Source type"
                value={getSourceType(mirror)}
                tooltipMessage="You can’t change the source type after the mirror is created."
              />
              <ReadOnlyField
                label="Source URL"
                value={mirror.archiveRoot}
                tooltipMessage="You can’t change the source URL after the mirror is created."
              />
              <CheckboxInputWithHelp
                label="Preserve upstream signing key"
                tooltipMessage={SETTINGS_HELP_TEXT.preserveSignatures}
                {...formik.getFieldProps("preserveSignatures")}
                checked={formik.values.preserveSignatures}
                disabled
              />
            </Blocks.Item>
            <Blocks.Item title="Mirror contents">
              <ReadOnlyField
                label="Distribution"
                value={mirror.distribution || NO_DATA_TEXT}
                tooltipMessage="You can’t change the distribution after the mirror is created."
              />
              <ReadOnlyField
                label="Components"
                value={mirror.components.join(", ")}
                tooltipMessage="You can’t change the components after the mirror is created."
              />
              <ReadOnlyField
                label="Architectures"
                value={mirror.architectures?.join(", ") || NO_DATA_TEXT}
                tooltipMessage="You can’t change the architectures after the mirror is created."
              />
              <div className={classes.wrapper}>
                <div className={classes.formContainer}>
                  <Input
                    type="text"
                    label="Filter"
                    {...formik.getFieldProps("packageFilter")}
                    disabled={formik.values.preserveSignatures}
                    help="The filter limits what packages are mirrored."
                  />
                </div>
                <MirrorFilterHelpButton />
              </div>
              <CheckboxInputWithHelp
                label="Include dependencies in filter"
                tooltipMessage={SETTINGS_HELP_TEXT.includeDependencies}
                {...formik.getFieldProps("includeDependencies")}
                checked={
                  !!formik.values.packageFilter &&
                  formik.values.includeDependencies
                }
                disabled={
                  !formik.values.packageFilter ||
                  formik.values.preserveSignatures
                }
              />
              <p className={classes.heading}>Download options:</p>
              <CheckboxInputWithHelp
                label="Download .udeb packages"
                tooltipMessage={SETTINGS_HELP_TEXT.downloadUdebPackages}
                {...formik.getFieldProps("downloadUdebPackages")}
                checked={formik.values.downloadUdebPackages}
              />
              <CheckboxInput
                label="Download sources"
                {...formik.getFieldProps("downloadSources")}
                checked={formik.values.downloadSources}
              />
              <CheckboxInput
                label="Download installer files"
                {...formik.getFieldProps("downloadInstallerFiles")}
                checked={formik.values.downloadInstallerFiles}
              />
              {shouldShowAuthentication(mirror) && (
                <Blocks.Item title="Authentication">
                  <GpgKeyField
                    existingKey={mirror.gpgKey}
                    keepCurrentKey={formik.values.keepCurrentGpgKey}
                    gpgKeyValue={formik.values.verificationGpgKey}
                    gpgKeyError={getFormikError(formik, "verificationGpgKey")}
                    textareaLabel="Verification GPG key"
                    onKeepCurrentChange={(checked) =>
                      formik.setFieldValue("keepCurrentGpgKey", checked)
                    }
                    onGpgKeyChange={(value) =>
                      formik.setFieldValue("verificationGpgKey", value)
                    }
                    onGpgKeyBlur={() =>
                      formik.setFieldTouched("verificationGpgKey", true)
                    }
                  />
                </Blocks.Item>
              )}
            </Blocks.Item>
          </Blocks>
          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting}
            submitButtonText="Save changes"
            onCancel={popSidePathUntilClear}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default EditMirrorForm;
