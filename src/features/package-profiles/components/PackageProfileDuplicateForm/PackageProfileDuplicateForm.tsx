import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { Form, Input, Select } from "@canonical/react-components";
import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { CopyPackageProfileParams, usePackageProfiles } from "../../hooks";
import { DuplicateFormProps, PackageProfile } from "../../types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";

interface PackageProfileDuplicateFormProps {
  profile: PackageProfile;
}

const PackageProfileDuplicateForm: FC<PackageProfileDuplicateFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { copyPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: copyPackageProfile } = copyPackageProfileQuery;

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  accessGroupOptions.unshift({ label: "Select access group", value: "" });

  const handleSubmit = async (values: DuplicateFormProps) => {
    const valuesToSubmit: CopyPackageProfileParams = {
      all_computers: values.all_computers,
      access_group: values.access_group,
      copy_from: profile.title,
      description: values.description,
      title: values.title,
    };

    if (!values.all_computers && values.tags.length > 0) {
      valuesToSubmit.tags = values.tags;
    }

    try {
      await copyPackageProfile(valuesToSubmit);

      closeSidePanel();

      notify.success({
        message: `Profile "${profile.title}" duplicated successfully`,
        title: "Profile duplicated",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<DuplicateFormProps>({
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
      title: `${profile.title} (copy)`,
    });
  }, [profile]);

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
        autoComplete="off"
        {...formik.getFieldProps("description")}
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
      />

      <Select
        label="Access group"
        {...formik.getFieldProps("access_group")}
        options={accessGroupOptions}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Duplicate"
      />
    </Form>
  );
};

export default PackageProfileDuplicateForm;
