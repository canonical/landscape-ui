import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useGetMirror, useUpdateMirror } from "../../api";
import { useFormik } from "formik";
import type { FormProps } from "./types";
import Blocks from "@/components/layout/Blocks";
import {
  CheckboxInput,
  Form,
  Icon,
  ICONS,
  Input,
  Tooltip,
} from "@canonical/react-components";
import GpgKeyField from "@/components/form/GpgKeyField";
import { getFormikError } from "@/utils/formikErrors";
import { getSourceType } from "../MirrorDetails/helpers";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";
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
      includeDependencies: mirror.filterWithDeps,
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
              : null,
          }),
          filter: values.packageFilter,
          filterWithDeps: values.packageFilter
            ? values.includeDependencies
            : undefined,
        });

        closeSidePanel();

        notify.success({
          title: `You have successfully edited ${mirror.displayName}.`,
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
                value={getSourceType(mirror.archiveRoot)}
                tooltipMessage="You can’t change the source type after the mirror is created."
              />
              <ReadOnlyField
                label="Source URL"
                value={mirror.archiveRoot}
                tooltipMessage="You can’t change the source URL after the mirror is created."
              />
              <CheckboxInput
                label="Preserve upstream signing key"
                {...formik.getFieldProps("preserveSignatures")}
                checked={formik.values.preserveSignatures}
                disabled
                inline
              />{" "}
              <Tooltip
                position="right"
                message="Signature-preserving mirrors directly copy the packages from the source to their destination without signing or syncing the packages."
              >
                <Icon name={ICONS.help} />
              </Tooltip>
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
              <CheckboxInput
                label="Include dependencies in filter"
                {...formik.getFieldProps("includeDependencies")}
                checked={
                  !!formik.values.packageFilter &&
                  formik.values.includeDependencies
                }
                disabled={
                  !formik.values.packageFilter ||
                  formik.values.preserveSignatures
                }
                inline
              />
              <p className={classes.heading}>Download options:</p>
              <CheckboxInput
                label="Download .udeb packages "
                {...formik.getFieldProps("downloadUdebPackages")}
                checked={formik.values.downloadUdebPackages}
                inline
              />
              <Tooltip
                position="right"
                message="Enables the mirroring of micro-debian (.udeb) packages. These are essential if you intend to use this mirror for network booting (PXE), netboot installations, or hardware discovery during the initial OS installation process."
              >
                <Icon name={ICONS.help} />
              </Tooltip>
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
              {![
                UBUNTU_ARCHIVE_HOST,
                UBUNTU_SNAPSHOTS_HOST,
                UBUNTU_PRO_HOST,
              ].includes(new URL(mirror.archiveRoot).host) && (
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
