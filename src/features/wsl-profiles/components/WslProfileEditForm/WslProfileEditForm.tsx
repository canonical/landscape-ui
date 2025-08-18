import AssociationBlock from "@/components/form/AssociationBlock";
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
import { useEditWslProfile } from "../../api";
import { CLOUD_INIT_OPTIONS } from "../constants";
import type { WslProfileSidePanelComponentProps } from "../WslProfileSidePanel";
import WslProfileSidePanel from "../WslProfileSidePanel";
import { getValidationSchema } from "./helpers";
import classes from "./WslProfileEditForm.module.scss";

interface FormProps {
  title: string;
  access_group: string;
  description: string;
  instanceType: string;
  customImageName: string;
  rootfsImage: string;
  all_computers: boolean;
  tags: string[];
}

const Component: FC<WslProfileSidePanelComponentProps> = ({
  wslProfile: profile,
}) => {
  const { getAccessGroupQuery } = useRoles();
  const debug = useDebug();
  const { sidePath, popSidePath, setPageParams } = usePageParams();
  const { notify } = useNotify();

  const { editWslProfile } = useEditWslProfile();
  const { wslInstanceTypes } = useGetWslInstanceTypes();

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

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupResultOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const closeSidePanel = () => {
    setPageParams({ sidePath: [], wslProfile: "" });
  };

  const handleSubmit = async (values: FormProps) => {
    try {
      await editWslProfile({
        name: profile.name,
        title: values.title,
        access_group: values.access_group,
        description: values.description,
        all_computers: values.all_computers,
        tags: values.tags,
      });

      closeSidePanel();

      notify.success({
        title: "WSL profile updated",
        message: `WSL profile "${profile.title}" updated successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: profile.title,
      access_group: profile.access_group,
      description: profile.description,
      instanceType: profile.image_source ? "custom" : profile.image_name,
      customImageName: profile.image_source ? profile.image_name : "",
      rootfsImage: profile.image_source || "",
      all_computers: profile.all_computers,
      tags: profile.tags,
    },
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(),
  });

  return (
    <>
      <SidePanel.Header>
        Edit &quot;{profile.title}&quot; profile
      </SidePanel.Header>
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
            options={accessGroupResultOptions}
            required
            {...formik.getFieldProps("access_group")}
            error={getFormikError(formik, "access_group")}
          />

          <div className={classes.block}>
            <Notification severity="caution" title="Editing unavailable">
              <span>
                You cannot edit rootfs image or cloud-init file. To modify these
                fields, create a new profile.
              </span>
            </Notification>

            <Select
              disabled
              label="Rootfs image"
              aria-label="Rootfs image"
              options={ROOTFS_IMAGE_OPTIONS}
              {...formik.getFieldProps("instanceType")}
              error={getFormikError(formik, "instanceType")}
            />

            {formik.values.instanceType === "custom" && (
              <>
                <Input
                  disabled
                  label="Image name"
                  type="text"
                  required
                  {...formik.getFieldProps("customImageName")}
                  error={getFormikError(formik, "customImageName")}
                />
                <Input
                  disabled
                  type="text"
                  label="Rootfs image URL"
                  required
                  {...formik.getFieldProps("rootfsImage")}
                  error={getFormikError(formik, "rootfsImage")}
                  help="The file path must be reachable by the affected WSL instances."
                />
              </>
            )}

            <Select
              label="Cloud-init"
              aria-label="Cloud-init"
              options={CLOUD_INIT_OPTIONS}
              disabled
            />
          </div>

          <AssociationBlock formik={formik} />

          <SidePanelFormButtons
            submitButtonText="Save changes"
            submitButtonDisabled={formik.isSubmitting}
            onCancel={closeSidePanel}
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

const WslProfileEditForm: FC = () => (
  <WslProfileSidePanel Component={Component} />
);

export default WslProfileEditForm;
