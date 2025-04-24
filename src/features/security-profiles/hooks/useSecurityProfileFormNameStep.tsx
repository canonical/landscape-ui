import { useOrgSettings } from "@/features/organisation-settings";
import useEnv from "@/hooks/useEnv";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Input, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";

export default function useSecurityProfileFormNameStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>) {
  const { isSelfHosted } = useEnv();

  const { getOrganisationPreferences } = useOrgSettings();
  const { getAccessGroupQuery } = useRoles();

  const {
    data: getAccessGroupQueryResponse,
    isLoading: isLoadingAccessGroups,
  } = getAccessGroupQuery();

  const {
    data: getOrganisationPreferencesResponse,
    isLoading: isLoadingOrganisationPreferences,
  } = getOrganisationPreferences();

  return {
    isLoading: isLoadingAccessGroups || isLoadingOrganisationPreferences,
    isValid: !formik.errors.title,
    description:
      "Choose a descriptive profile name and the right access group for your security profile.",
    content: (
      <>
        <Input
          type="text"
          label="Profile name"
          {...formik.getFieldProps("title")}
          error={getFormikError(formik, "title")}
          required
        />

        <Select
          label="Access group"
          options={getAccessGroupQueryResponse?.data.map((group) => ({
            label: group.title,
            value: group.name,
          }))}
          {...formik.getFieldProps("access_group")}
          error={getFormikError(formik, "access_group")}
          required
          disabled={isLoadingAccessGroups}
        />

        {isSelfHosted && (
          <Input
            type="text"
            label="Audit retention"
            required
            disabled
            value={
              getOrganisationPreferencesResponse?.data.audit_retention_period ==
              -1
                ? "Infinite"
                : `${getOrganisationPreferencesResponse?.data.audit_retention_period} day${getOrganisationPreferencesResponse?.data.audit_retention_period == 1 ? "" : "s"}`
            }
            help="You can change this limit in the Landscape server configuration file."
          />
        )}
      </>
    ),
    submitButtonText: "Next",
  };
}
