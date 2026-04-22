import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { ComponentProps, FC } from "react";
import type { FormProps } from "./types";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import Blocks from "@/components/layout/Blocks";
import {
  useCreateMirror,
  useGetUbuntuArchiveInfo,
  useGetUbuntuEsmInfo,
} from "../../api";
import { getInitialValues } from "./helpers";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import SelectableMirrorContentsBlock from "../SelectableMirrorContentsBlock";
import { UBUNTU_SNAPSHOTS_HOST } from "../../constants";

const AddMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createPageParamsSetter } = usePageParams();

  const ubuntuArchiveInfo = useGetUbuntuArchiveInfo().data.data;
  const ubuntuEsmInfo = useGetUbuntuEsmInfo().data.data.results;
  const createMirror = useCreateMirror().mutateAsync;
  const close = createPageParamsSetter({ sidePath: [] });

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues({
      ubuntuArchiveInfo,
      ubuntuEsmInfo,
    }),
    onSubmit: async (values) => {
      try {
        const archiveRoot =
          values.sourceType === "ubuntu-snapshots"
            ? `https://${UBUNTU_SNAPSHOTS_HOST}/ubuntu/${values.snapshotDate}`
            : values.sourceUrl;

        await createMirror({
          archiveRoot,
          components: values.components.map((component) => component.trim()),
          displayName: values.name,
          architectures: values.architectures.map((architecture) =>
            architecture.trim(),
          ),
          distribution: values.distribution,
          downloadInstaller: values.downloadInstallerFiles,
          downloadSources: values.downloadSources,
          downloadUdebs: values.downloadUdebPackages,
          gpgKey:
            values.verificationGpgKey === undefined
              ? undefined
              : {
                  armor: values.verificationGpgKey,
                },
        });

        close();

        notify.success({
          title: `You have successfully added ${values.name}.`,
          message: "The mirror has been created.",
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const proServiceOptions: SelectOption[] = ubuntuEsmInfo.map(
    ({ label, mirror_type }) => ({
      label,
      value: mirror_type,
    }),
  );

  return (
    <>
      <SidePanel.Header>Add mirror</SidePanel.Header>
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
              <Select
                label="Source type"
                required
                options={[
                  {
                    label: "Ubuntu archive",
                    value: "ubuntu-archive",
                    disabled: !ubuntuArchiveInfo.distributions.length,
                  },
                  {
                    label: "Ubuntu snapshots",
                    value: "ubuntu-snapshots",
                    disabled: !ubuntuArchiveInfo.distributions.length,
                  },
                  {
                    label: "Ubuntu Pro",
                    value: "ubuntu-pro",
                    disabled: !ubuntuEsmInfo.length,
                  },
                  { label: "Third party", value: "third-party" },
                ]}
                {...formik.getFieldProps("sourceType")}
                onChange={(event) => {
                  if (
                    !(
                      event.target.value === "ubuntu-archive" ||
                      event.target.value === "ubuntu-snapshots" ||
                      event.target.value === "ubuntu-pro" ||
                      event.target.value === "third-party"
                    )
                  ) {
                    throw new Error();
                  }

                  formik.setValues({
                    ...getInitialValues({
                      sourceType: event.target.value,
                      ubuntuArchiveInfo,
                      ubuntuEsmInfo,
                    }),
                    name: formik.values.name,
                    downloadUdebPackages: formik.values.downloadUdebPackages,
                    downloadInstallerFiles:
                      formik.values.downloadInstallerFiles,
                    downloadSources: formik.values.downloadSources,
                  });
                }}
                error={getFormikError(formik, "sourceType")}
              />
              {formik.values.sourceType === "ubuntu-pro" && (
                <Input
                  type="text"
                  label="Token"
                  required
                  {...formik.getFieldProps("token")}
                  error={getFormikError(formik, "token")}
                />
              )}
              <Input
                type="text"
                label="Source URL"
                required
                {...formik.getFieldProps("sourceUrl")}
                error={getFormikError(formik, "sourceUrl")}
                readOnly={formik.values.sourceType !== "third-party"}
              />
            </Blocks.Item>
            <Blocks.Item title="Mirror contents">
              {formik.values.sourceType === "ubuntu-snapshots" && (
                <Input
                  type="date"
                  label="Snapshot date"
                  required
                  {...formik.getFieldProps("snapshotDate")}
                  error={getFormikError(formik, "snapshotDate")}
                />
              )}
              {formik.values.sourceType === "ubuntu-pro" && (
                <Select
                  label="Pro service"
                  required
                  options={proServiceOptions}
                  {...formik.getFieldProps("proService")}
                  error={getFormikError(formik, "proService")}
                />
              )}
              {formik.values.sourceType === "third-party" ? (
                <>
                  <Input
                    type="text"
                    label="Distribution"
                    required
                    {...formik.getFieldProps("distribution")}
                    error={getFormikError(formik, "distribution")}
                  />
                  <Input
                    type="text"
                    label="Components"
                    {...formik.getFieldProps("components")}
                    error={getFormikError(formik, "components")}
                    onChange={async (event) => {
                      await formik.setFieldValue(
                        "components",
                        event.target.value.split(","),
                      );
                    }}
                  />
                  <Input
                    type="text"
                    label="Architectures"
                    {...formik.getFieldProps("architectures")}
                    error={getFormikError(formik, "architectures")}
                    onChange={async (event) => {
                      await formik.setFieldValue(
                        "architectures",
                        event.target.value.split(","),
                      );
                    }}
                  />
                </>
              ) : (
                <SelectableMirrorContentsBlock
                  formik={
                    formik as ComponentProps<
                      typeof SelectableMirrorContentsBlock
                    >["formik"]
                  }
                  ubuntuArchiveInfo={ubuntuArchiveInfo}
                  ubuntuEsmInfo={ubuntuEsmInfo}
                />
              )}
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
            </Blocks.Item>
            {formik.values.sourceType === "third-party" && (
              <Blocks.Item title="Authentication">
                <Textarea
                  label="Verification GPG key"
                  {...formik.getFieldProps("verificationGpgKey")}
                  error={getFormikError(formik, "verificationGpgKey")}
                />
              </Blocks.Item>
            )}
          </Blocks>
          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting}
            submitButtonText="Add mirror"
            onCancel={close}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default AddMirrorForm;
