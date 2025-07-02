import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Form, Input, Notification, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useWslProfiles } from "../../hooks";
import type { WslProfile } from "../../types";
import { CLOUD_INIT_OPTIONS } from "../constants";
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

interface WslProfileEditFormProps {
  readonly profile: WslProfile;
}

const WslProfileEditForm: FC<WslProfileEditFormProps> = ({ profile }) => {
  const { getAccessGroupQuery } = useRoles();
  const { getWslInstanceNamesQuery } = useWsl();
  const { editWslProfileQuery } = useWslProfiles();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();

  const { mutateAsync: editWslProfile } = editWslProfileQuery;

  const { data: getWslInstanceNamesQueryResult } = getWslInstanceNamesQuery();

  const instanceQueryResultOptions =
    (getWslInstanceNamesQueryResult?.data ?? []).map(({ label, name }) => ({
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
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />

      <Input
        type="text"
        label="Description"
        required
        {...formik.getFieldProps("description")}
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
      />

      <Select
        label="Access group"
        aria-label="Access group"
        options={accessGroupResultOptions}
        required
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <div className={classes.block}>
        <Notification severity="caution" title="Editing unavailable">
          <span>
            You cannot edit RootFS image or Cloud-init file. To modify these
            fields, create a new profile.
          </span>
        </Notification>

        <Select
          disabled
          label="RootFS image"
          aria-label="RootFS image"
          options={ROOTFS_IMAGE_OPTIONS}
          {...formik.getFieldProps("instanceType")}
          error={
            formik.touched.instanceType && formik.errors.instanceType
              ? formik.errors.instanceType
              : undefined
          }
        />

        {formik.values.instanceType === "custom" && (
          <>
            <Input
              disabled
              label="Image name"
              type="text"
              required
              {...formik.getFieldProps("customImageName")}
              error={
                formik.touched.customImageName && formik.errors.customImageName
                  ? formik.errors.customImageName
                  : undefined
              }
            />
            <Input
              disabled
              type="text"
              label="RootFS image URL"
              required
              {...formik.getFieldProps("rootfsImage")}
              error={
                formik.touched.rootfsImage && formik.errors.rootfsImage
                  ? formik.errors.rootfsImage
                  : undefined
              }
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
      />
    </Form>
  );
};

export default WslProfileEditForm;
