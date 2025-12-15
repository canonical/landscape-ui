import type { FormikContextType } from "formik";
import type { FC } from "react";
import { Input, Select } from "@canonical/react-components";
import AssociationBlock from "@/components/form/AssociationBlock";
import type { RepositoryProfileFormValues } from "../../types";
import type { AccessGroup } from "@/features/access-groups";
import { getFormikError } from "@/utils/formikErrors";

interface RepositoryProfileFormDetailsPanelProps {
  readonly accessGroups: AccessGroup[];
  readonly formik: FormikContextType<RepositoryProfileFormValues>;
  readonly isTitleRequired?: boolean;
  readonly isAccessGroupDisabled?: boolean;
}

const RepositoryProfileFormDetailsPanel: FC<
  RepositoryProfileFormDetailsPanelProps
> = ({
  accessGroups,
  formik,
  isTitleRequired = false,
  isAccessGroupDisabled = false,
}) => {
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
        error={getFormikError(formik, "title")}
        {...formik.getFieldProps("title")}
      />
      <Input
        type="text"
        label="Description"
        autoComplete="off"
        error={getFormikError(formik, "description")}
        {...formik.getFieldProps("description")}
      />
      <Select
        label="Access group"
        options={accessGroupOptions}
        disabled={isAccessGroupDisabled}
        error={getFormikError(formik, "access_group")}
        {...formik.getFieldProps("access_group")}
      />
      <AssociationBlock formik={formik} />
    </>
  );
};

export default RepositoryProfileFormDetailsPanel;
