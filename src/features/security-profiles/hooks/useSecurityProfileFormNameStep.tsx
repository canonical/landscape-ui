import { useOrgSettings } from "@/features/organisation-settings";
import useEnv from "@/hooks/useEnv";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { getFormikError } from "@/utils/formikErrors";
import { Input, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";

export default function useSecurityProfileFormNameStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>, formMode: "add" | "edit") {
  const { isSelfHosted } = useEnv();

  const { getOrganisationPreferences } = useOrgSettings();
  const { getAccessGroupQuery } = useRoles();

  const {
    data: getAccessGroupQueryResponse,
    isLoading: isLoadingAccessGroups,
  } = getAccessGroupQuery({}, { enabled: formMode === "add" });

  const {
    data: getOrganisationPreferencesResponse,
    isLoading: isLoadingOrganisationPreferences,
  } = getOrganisationPreferences();

  const getAuditRetentionPeriod = () => {
    const auditRetentionPeriod =
      getOrganisationPreferencesResponse?.data.audit_retention_period;

    if (!auditRetentionPeriod || auditRetentionPeriod === -1) {
      return "Infinite";
    }

    return `${auditRetentionPeriod} ${pluralize(auditRetentionPeriod, "day")}`;
  };

  return {
    isLoading: isLoadingAccessGroups || isLoadingOrganisationPreferences,
    isValid: !formik.errors.title,
    description:
      "Choose a descriptive title and the right access group for your security profile.",
    content: (
      <>
        <Input
          type="text"
          label="Title"
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
          disabled={isLoadingAccessGroups || formMode === "edit"}
        />

        {isSelfHosted && (
          <Input
            type="text"
            label="Audit retention"
            required
            disabled
            value={getAuditRetentionPeriod()}
            help="You can change this limit in the Landscape server configuration file."
          />
        )}
      </>
    ),
    submitButtonText: "Next",
  };
}
