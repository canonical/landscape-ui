import AssociationBlock from "@/components/form/AssociationBlock";
import CodeEditor from "@/components/form/CodeEditor";
import FileInput from "@/components/form/FileInput";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import { useGetWslInstanceTypes } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Notification, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { type FC } from "react";
import { useAddWslProfile } from "../../api";
import { CLOUD_INIT_OPTIONS, FILE_INPUT_HELPER_TEXT } from "../constants";
import { INITIAL_VALUES } from "./constants";
import { getCloudInitFile, getValidationSchema } from "./helpers";
import type { FormProps } from "./types";
import classes from "./WslProfileAddSidePanel.module.scss";

const WslProfileAddSidePanel: FC = () => {
  const debug = useDebug();
  const { setPageParams } = usePageParams();
  const { notify } = useNotify();
  const { getAccessGroupQuery } = useRoles();

  const { addWslProfile: addWslProfile } = useAddWslProfile();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();
  const { isGettingWslInstanceTypes, wslInstanceTypes } =
    useGetWslInstanceTypes();

  const instanceQueryResultOptions =
    wslInstanceTypes.map(({ label, name }) => ({
      label,
      value: name,
    })) || [];

  const ROOTFS_IMAGE_OPTIONS = [
    { label: "Select", value: "" },
    ...instanceQueryResultOptions,
    { label: "From URL", value: "custom" },
  ];

  const accessGroupResultOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const closeSidePanel = () => {
    setPageParams({ sidePath: [] });
  };

  const handleSubmit = async (values: FormProps) => {
    try {
      const strippedCloudInit = await getCloudInitFile(values.cloudInit);

      const profileResponse = await addWslProfile({
        title: values.title,
        access_group: values.access_group,
        description: values.description,
        image_name:
          values.instanceType === "custom"
            ? values.customImageName
            : values.instanceType,
        image_source: values.rootfsImage,
        cloud_init_contents: strippedCloudInit,
        all_computers: values.all_computers,
        tags: values.tags,
      });

      const affectedInstancesCount =
        profileResponse.data.computers.constrained.length;

      closeSidePanel();

      notify.success({
        title: `Profile "${values.title}" added successfully`,
        message: `It has been associated with ${affectedInstancesCount} instances`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(),
  });

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("cloudInit", files[0]);
  };

  const handleRemoveFile = async () => {
    await formik.setFieldValue("cloudInit", null);
  };

  return (
    <>
      <SidePanel.Header>Add WSL profile</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Input
            type="text"
            label="Title"
            required
            {...formik.getFieldProps("title")}
            error={getFormikError(formik, "title")}
          />

          <Input
            type="text"
            label="Description"
            required
            {...formik.getFieldProps("description")}
            error={getFormikError(formik, "description")}
          />

          <Select
            label="Access group"
            aria-label="Access group"
            required
            options={accessGroupResultOptions}
            {...formik.getFieldProps("access_group")}
            error={getFormikError(formik, "access_group")}
          />

          <div className={classes.block}>
            {(formik.values.instanceType !== "" ||
              formik.values.cloudInitType !== "") && (
              <Notification severity="caution" title="Warning">
                <span>
                  Once the profile is added, you cannot modify the rootfs image
                  or cloud-init file.
                </span>
              </Notification>
            )}
            <Select
              label="rootfs image"
              disabled={isGettingWslInstanceTypes}
              aria-label="rootfs image"
              options={ROOTFS_IMAGE_OPTIONS}
              required
              {...formik.getFieldProps("instanceType")}
              error={getFormikError(formik, "instanceType")}
            />

            {formik.values.instanceType === "custom" && (
              <>
                <Input
                  label="Image name"
                  type="text"
                  required
                  {...formik.getFieldProps("customImageName")}
                  error={getFormikError(formik, "customImageName")}
                />
                <Input
                  type="text"
                  label="rootfs image URL"
                  required
                  {...formik.getFieldProps("rootfsImage")}
                  error={getFormikError(formik, "rootfsImage")}
                  help="The file path must be reachable by the affected WSL instances."
                />
              </>
            )}

            <Select
              label="cloud-init"
              aria-label="cloud-init"
              options={CLOUD_INIT_OPTIONS}
              {...formik.getFieldProps("cloudInitType")}
              onChange={async (value) => {
                formik.getFieldProps("cloudInitType").onChange(value);
                await formik.setFieldValue("cloudInit", null);
              }}
              error={getFormikError(formik, "cloudInitType")}
            />

            {formik.values.cloudInitType === "file" && (
              <FileInput
                label="Upload cloud-init"
                labelClassName="u-off-screen"
                accept=".yaml"
                {...formik.getFieldProps("cloudInit")}
                value={
                  formik.values.cloudInit instanceof File
                    ? formik.values.cloudInit
                    : null
                }
                onFileRemove={handleRemoveFile}
                onFileUpload={handleFileUpload}
                help={FILE_INPUT_HELPER_TEXT}
                error={getFormikError(formik, "cloudInit")}
              />
            )}

            {formik.values.cloudInitType === "text" && (
              <CodeEditor
                label="cloud-init configuration"
                onChange={(value) => {
                  formik.setFieldValue("cloudInit", value ?? "");
                }}
                value={
                  typeof formik.values.cloudInit === "string"
                    ? formik.values.cloudInit
                    : ""
                }
                language="yaml"
                defaultValue="# paste cloud-init config here"
                error={getFormikError(formik, "cloudInit")}
              />
            )}
          </div>

          <AssociationBlock formik={formik} />

          <SidePanelFormButtons
            submitButtonText="Add WSL profile"
            submitButtonAriaLabel="Add a new WSL profile"
            submitButtonDisabled={formik.isSubmitting}
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default WslProfileAddSidePanel;
