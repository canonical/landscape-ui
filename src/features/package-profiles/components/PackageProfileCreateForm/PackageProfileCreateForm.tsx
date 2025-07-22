import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import type { CreatePackageProfileParams } from "../../hooks";
import { usePackageProfiles } from "../../hooks";
import type { AddFormProps, PackageProfileConstraintType } from "../../types";
import PackageProfileConstraintsTypeBlock from "../PackageProfileConstraintsTypeBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";

const PackageProfileCreateForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { createPackageProfileQuery } = usePackageProfiles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: createPackageProfile } = createPackageProfileQuery;

  const handleSubmit = async (values: AddFormProps) => {
    const valuesToProfileCreation: CreatePackageProfileParams = {
      access_group: values.access_group,
      description: values.description,
      title: values.title,
    };

    if (values.all_computers) {
      valuesToProfileCreation.all_computers = true;
    } else if (values.tags.length > 0) {
      valuesToProfileCreation.tags = values.tags;
    }

    if (values.constraintsType === "material") {
      valuesToProfileCreation.material = values.material;
    } else if (values.constraintsType === "instance") {
      valuesToProfileCreation.source_computer_id = values.source_computer_id;
    } else {
      valuesToProfileCreation.constraints = values.constraints.map(
        ({ constraint, package: package_name, rule, version }) => ({
          constraint: constraint as PackageProfileConstraintType,
          package: package_name,
          rule,
          version,
        }),
      );
    }

    try {
      await createPackageProfile(valuesToProfileCreation);

      closeSidePanel();

      notify.success({
        message: `Profile "${values.title}" added successfully`,
        title: "Profile added",
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

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
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

      <PackageProfileConstraintsTypeBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add package profile"
      />
    </Form>
  );
};

export default PackageProfileCreateForm;
