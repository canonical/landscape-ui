import { FormikContextType } from "formik";
import { FC } from "react";
import { Input, Select } from "@canonical/react-components";
import AssociationBlock from "@/components/form/AssociationBlock";
import { RepositoryProfileFormValues } from "@/features/repository-profiles/types";
import { AccessGroup } from "@/types/AccessGroup";

interface RepositoryProfileFormDetailsPanelProps {
  accessGroups: AccessGroup[];
  formik: FormikContextType<RepositoryProfileFormValues>;
  isTitleRequired?: boolean;
}

const RepositoryProfileFormDetailsPanel: FC<
  RepositoryProfileFormDetailsPanelProps
> = ({ accessGroups, formik, isTitleRequired = false }) => {
  const accessGroupOptions = accessGroups.map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  return (
    <>
      <Input
        type="text"
        label="Title"
        required={isTitleRequired}
        autoComplete="off"
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
        {...formik.getFieldProps("title")}
      />
      <Input
        type="text"
        label="Description"
        autoComplete="off"
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
        {...formik.getFieldProps("description")}
      />
      <Select
        label="Access group"
        options={accessGroupOptions}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
        {...formik.getFieldProps("access_group")}
      />
      <AssociationBlock formik={formik} />
    </>
  );
};

export default RepositoryProfileFormDetailsPanel;
