import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { AccessGroupSelectFormProps } from "./types";

interface AccessGroupSelectProps<T extends AccessGroupSelectFormProps> {
  readonly formik: FormikContextType<T>;
}

const AccessGroupSelect = <T extends AccessGroupSelectFormProps>({
  formik,
}: AccessGroupSelectProps<T>) => {
  const { getAccessGroupQuery } = useRoles();

  const {
    data: getAccessGroupQueryResponse,
    isLoading: isLoadingAccessGroups,
  } = getAccessGroupQuery();

  return (
    <Select
      label="Access group"
      options={(getAccessGroupQueryResponse?.data ?? []).map((group) => ({
        label: group.title,
        value: group.name,
      }))}
      {...formik.getFieldProps("access_group")}
      error={getFormikError(formik, "access_group")}
      required
      disabled={isLoadingAccessGroups}
    />
  );
};

export default AccessGroupSelect;
