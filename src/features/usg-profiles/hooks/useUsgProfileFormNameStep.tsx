import ReadOnlyField from "@/components/form/ReadOnlyField";
import { useOrgSettings } from "@/features/organisation-settings";
import useEnv from "@/hooks/useEnv";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralizeWithCount } from "@/utils/_helpers";
import { getFormikError } from "@/utils/formikErrors";
import { Input, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { USGProfileFormValues } from "../types/USGProfileAddFormValues";

export default function useUsgProfileFormNameStep<
  T extends USGProfileFormValues,
>(formik: FormikContextType<T>, formMode: "add" | "edit") {
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

  const getAuditRetentionPeriod = () => {
    const auditRetentionPeriod =
      getOrganisationPreferencesResponse?.data.audit_retention_period;

    if (!auditRetentionPeriod || auditRetentionPeriod === -1) {
      return "Infinite";
    }

    return pluralizeWithCount(auditRetentionPeriod, "day");
  };

  return {
    isLoading: isLoadingAccessGroups || isLoadingOrganisationPreferences,
    isValid: !formik.errors.title,
    description:
      "Choose a descriptive title and the right access group for your USG profile.",
    content: (
      <>
        <Input
          type="text"
          label="Title"
          {...formik.getFieldProps("title")}
          error={getFormikError(formik, "title")}
          required
        />
        {formMode === "edit" ? (
          <ReadOnlyField
            label="Access group"
            value={getTitleByName(
              formik.values.access_group,
              getAccessGroupQueryResponse,
            )}
            tooltipMessage="You can't change the access group after the USG profile has been created"
          />
        ) : (
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
        )}

        {isSelfHosted && (
          <ReadOnlyField
            label="Audit retention"
            value={getAuditRetentionPeriod()}
            tooltipMessage="You can change this limit in the Landscape server configuration file"
          />
        )}
      </>
    ),
    submitButtonText: "Next",
  };
}
