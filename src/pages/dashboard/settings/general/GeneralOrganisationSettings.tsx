import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  EditOrganisationPreferencesForm,
  useOrgSettings,
} from "@/features/organisation-settings";
import { Button } from "@canonical/react-components";
import { FC } from "react";

const GeneralOrganisationSettings: FC = () => {
  const { getOrganisationPreferences } = useOrgSettings();
  const {
    data: orgPreferencesData,
    isLoading,
    refetch,
  } = getOrganisationPreferences();
  const organisationPreferences = orgPreferencesData?.data;

  const handleRefetch = () => {
    refetch();
  };

  return (
    <PageMain>
      <PageHeader title="General" />
      <PageContent container="medium">
        {isLoading && <LoadingState />}
        {!isLoading && !organisationPreferences && (
          <EmptyState
            title="Could not load general information"
            icon="connected"
            cta={[
              <Button
                type="button"
                key="refetch"
                appearance="positive"
                onClick={handleRefetch}
              >
                Try again
              </Button>,
            ]}
          />
        )}
        {organisationPreferences && !isLoading && (
          <EditOrganisationPreferencesForm
            organisationPreferences={organisationPreferences}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default GeneralOrganisationSettings;
