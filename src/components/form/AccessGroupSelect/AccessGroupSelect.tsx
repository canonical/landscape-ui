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

  const options = isLoadingAccessGroups
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
      }));

  const handleChange = async (value: string) =>
    formik.setFieldValue("access_group", value);

  return (
    <CustomSelect
      label="Access group"
      options={options}
      value={formik.values.access_group}
      onChange={handleChange}
      searchable="always"
      error={getFormikError(formik, "access_group")}
      required
    />
  );
};

export default AccessGroupSelect;
