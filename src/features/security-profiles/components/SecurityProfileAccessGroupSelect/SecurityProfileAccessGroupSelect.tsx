import LoadingState from "@/components/layout/LoadingState";
import useRoles from "@/hooks/useRoles";
import { CustomSelect } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";

const SecurityProfileAccessGroupSelect: FC<{
  readonly formik: FormikContextType<SecurityProfileAddFormValues>;
}> = ({ formik }) => {
  const { getAccessGroupQuery } = useRoles();

  const {
    data: getAccessGroupQueryResponse,
    isLoading: isLoadingAccessGroups,
  } = getAccessGroupQuery();

  if (isLoadingAccessGroups) {
    return <LoadingState />;
  }

  return (
    <CustomSelect
      label="Access group"
      options={(getAccessGroupQueryResponse?.data ?? []).map((group) => ({
        label: group.title,
        value: group.name,
      }))}
      value={formik.values.accessGroup}
      onChange={async (value) => formik.setFieldValue("accessGroup", value)}
    />
  );
};

export default SecurityProfileAccessGroupSelect;
