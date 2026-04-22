import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import usePageParams from "@/hooks/usePageParams/usePageParams";
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
  Input,
  Textarea,
} from "@canonical/react-components";
import { getFormikError } from "@/utils/formikErrors";
import { getSourceType } from "../MirrorDetails/helpers";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";

const EditMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { name, sidePath, popSidePath, createPageParamsSetter } =
    usePageParams();

  const mirror = useGetMirror(decodeURIComponent(name)).data.data;
  const updateMirror = useUpdateMirror().mutateAsync;

  const close = createPageParamsSetter({ sidePath: [], name: "" });

  const formik = useFormik<FormProps>({
    initialValues: {
      name: mirror.displayName,
      downloadUdebPackages: !!mirror.downloadUdebs,
      downloadSources: !!mirror.downloadSources,
      downloadInstallerFiles: !!mirror.downloadInstaller,
      verificationGpgKey: mirror.gpgKey?.armor,
    },
    onSubmit: async (values) => {
      try {
        await updateMirror({
          mirrorName: name,
          params: {
            displayName: values.name,
            archiveRoot: mirror.archiveRoot,
            components: mirror.components,
            downloadUdebs: values.downloadUdebPackages,
            downloadSources: values.downloadSources,
            downloadInstaller: values.downloadInstallerFiles,
            gpgKey:
              values.verificationGpgKey === undefined
                ? undefined
                : { armor: values.verificationGpgKey },
          },
        });

        close();

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
              <Input
                type="text"
                label="Source type"
                required
                readOnly
                value={getSourceType(mirror.archiveRoot)}
              />
              <Input
                type="text"
                label="Source URL"
                required
                readOnly
                value={mirror.archiveRoot}
              />
            </Blocks.Item>
            <Blocks.Item title="Mirror contents">
              <Input
                type="text"
                label="Distribution"
                required
                readOnly
                value={mirror.distribution}
              />
              <Input
                type="text"
                label="Components"
                required
                readOnly
                value={mirror.components.join(", ")}
              />
              <Input
                type="text"
                label="Architectures"
                required
                readOnly
                value={mirror.architectures?.join(", ")}
              />
              <p>Download options:</p>
              <CheckboxInput
                label="Download .udeb packages"
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
              {![
                UBUNTU_ARCHIVE_HOST,
                UBUNTU_SNAPSHOTS_HOST,
                UBUNTU_PRO_HOST,
              ].includes(mirror.archiveRoot) && (
                <Blocks.Item title="Authentication">
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
            onCancel={close}
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default EditMirrorForm;
