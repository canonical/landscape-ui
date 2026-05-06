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
  Textarea,
  Tooltip,
} from "@canonical/react-components";
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

const EditMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { name, popSidePathUntilClear, closeSidePanel } = usePageParams();

  const mirror = useGetMirror(name).data.data;
  const updateMirror = useUpdateMirror(name).mutateAsync;

  const formik = useFormik<FormProps>({
    initialValues: {
      name: mirror.displayName,
      downloadUdebPackages: !!mirror.downloadUdebs,
      downloadSources: !!mirror.downloadSources,
      downloadInstallerFiles: !!mirror.downloadInstaller,
      verificationGpgKey: mirror.gpgKey?.armor,
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
          downloadUdebs: values.downloadUdebPackages,
          downloadSources: values.downloadSources,
          downloadInstaller: values.downloadInstallerFiles,
          gpgKey: { armor: values.verificationGpgKey || null },
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
            <Blocks.Item title="Details" titleClassName="p-text--small-caps">
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
            </Blocks.Item>
            <Blocks.Item
              title="Mirror contents"
              titleClassName="p-text--small-caps"
            >
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
              <p>Download options:</p>
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
                <Blocks.Item
                  title="Authentication"
                  titleClassName="p-text--small-caps"
                >
                  <Textarea
                    label="Verification GPG key"
                    {...formik.getFieldProps("verificationGpgKey")}
                    error={getFormikError(formik, "verificationGpgKey")}
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
