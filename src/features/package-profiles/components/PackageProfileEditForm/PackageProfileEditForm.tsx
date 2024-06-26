import { FC, useEffect } from "react";
import { EditFormProps, PackageProfile } from "../../types";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { usePackageProfiles } from "../../hooks";
import { useFormik } from "formik";
import useRoles from "@/hooks/useRoles";
import { Form, Input, Select } from "@canonical/react-components";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import AssociationBlock from "@/components/form/AssociationBlock";
import useNotify from "@/hooks/useNotify";

interface PackageProfileEditFormProps {
  profile: PackageProfile;
}

const PackageProfileEditForm: FC<PackageProfileEditFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editPackageProfileQuery } = usePackageProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const handleSubmit = async (values: EditFormProps) => {
    try {
      await editPackageProfile({
        ...values,
        name: profile.name,
        tags: values.all_computers ? [] : values.tags,
      });

      closeSidePanel();

      notify.success({
        message: `Package profile "${profile.name}" updated successfully`,
        title: "Package profile updated",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    formik.setValues({
      access_group: profile.access_group,
      all_computers: profile.all_computers,
      description: profile.description,
      tags: profile.tags,
      title: profile.title,
    });
  }, [profile]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
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
        {...formik.getFieldProps("description")}
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
      />

      <Select
        label="Access group"
        options={accessGroupOptions}
        {...formik.getFieldProps("access_group")}
        error={
          (formik.touched.access_group && formik.errors.access_group) ||
          undefined
        }
      />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default PackageProfileEditForm;
