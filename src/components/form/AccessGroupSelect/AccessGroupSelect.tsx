import LoadingState from "@/components/layout/LoadingState";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { CustomSelect } from "@canonical/react-components";
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
    <CustomSelect
      label="Access group"
      options={
        isLoadingAccessGroups
          ? [
              {
                label: <LoadingState />,
                value: "loading",
                disabled: true,
              },
            ]
          : (getAccessGroupQueryResponse?.data ?? []).map((group) => ({
              label: group.title,
              value: group.name,
            }))
      }
      value={formik.values.access_group}
      onChange={async (value) => formik.setFieldValue("access_group", value)}
      searchable="always"
      error={getFormikError(formik, "access_group")}
      required
    />
  );
};

export default AccessGroupSelect;
