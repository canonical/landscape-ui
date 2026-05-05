import type { FormikContextType } from "formik";
import type { FC } from "react";
import { Input, Select } from "@canonical/react-components";
import type { RepositoryProfileFormValues } from "../../types";
import type { AccessGroup } from "@/features/access-groups";
import { getFormikError } from "@/utils/formikErrors";
import ReadOnlyField from "@/components/form/ReadOnlyField";

interface RepositoryProfileFormDetailsPanelProps {
  readonly accessGroups: AccessGroup[];
  readonly formik: FormikContextType<RepositoryProfileFormValues>;
  readonly isTitleRequired?: boolean;
  readonly isAccessGroupDisabled?: boolean;
}

const RepositoryProfileFormDetailsPanel: FC<
  RepositoryProfileFormDetailsPanelProps
> = ({ accessGroups, formik, isAccessGroupDisabled = false }) => {
  const accessGroupOptions = accessGroups.map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  const accessGroupTitle =
    accessGroups.find((ag) => ag.name === formik.values.access_group)?.title ??
    formik.values.access_group;

  return (
    <>
      <Input
        type="text"
        label="Profile name"
        required
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
      {isAccessGroupDisabled ? (
        <ReadOnlyField
          label="Access group"
          value={accessGroupTitle}
          tooltipMessage={`You can't change the access group after the repository profile has been created`}
        />
      ) : (
        <Select
          label="Access group"
          options={accessGroupOptions}
          required
          error={getFormikError(formik, "access_group")}
          {...formik.getFieldProps("access_group")}
        />
      )}
    </>
  );
};

export default RepositoryProfileFormDetailsPanel;
