import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useGetWslInstanceTypes } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Notification, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { type FC } from "react";
import { useEditWslProfile } from "../../../../api";
import type { WslProfile } from "../../../../types";
import { CLOUD_INIT_OPTIONS } from "../../../constants";
import { getValidationSchema } from "./helpers";
import classes from "./WslProfileEditForm.module.scss";

interface WslProfileEditFormProps {
  readonly profile: WslProfile;
}

interface FormProps {
  title: string;
  description: string;
  instanceType: string;
  customImageName: string;
  rootfsImage: string;
  all_computers: boolean;
  tags: string[];
}

const WslProfileEditForm: FC<WslProfileEditFormProps> = ({ profile }) => {
  const { getAccessGroupQuery } = useRoles();
  const debug = useDebug();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
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

  const closeSidePanel = createPageParamsSetter({ sidePath: [], profile: "" });

  const handleSubmit = async (values: FormProps) => {
    try {
      await editWslProfile({
        name: profile.name,
        title: values.title,
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
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Notification severity="caution" title="Editing unavailable">
        <span>
          You cannot edit access group, rootfs image, cloud-init file, or
          compliance settings. To modify these fields, create a new profile.
        </span>
      </Notification>

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
        disabled
        required
      />

      <div className={classes.block}>
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

        <Select
          label="Compliance settings"
          options={[
            {
              label:
                "Ignore WSL child instances that have not been created by Landscape",
              value: "ignore",
            },
            {
              label:
                "Uninstall WSL child instances that have not been created by Landscape",
              value: "uninstall",
            },
          ]}
          disabled
          value={profile.only_landscape_created ? "uninstall" : "ignore"}
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
  );
};

export default WslProfileEditForm;
