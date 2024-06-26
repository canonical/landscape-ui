import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { OrganisationPreferences } from "@/features/organisation-settings";
import { useOrgSettings } from "@/hooks/useOrgSettings";
import useSidePanel from "@/hooks/useSidePanel";
import { Preferences } from "@/types/Preferences";
import { Button } from "@canonical/react-components";
import { FC, lazy, Suspense } from "react";

const EditOrganisationPreferencesForm = lazy(() =>
  import("@/features/organisation-settings").then((mod) => ({
    default: mod.EditOrganisationPreferencesForm,
  })),
);

const GeneralOrganisationSettings: FC = () => {
  const { setSidePanelContent } = useSidePanel();
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

  const handleEditOrganisation = () => {
    setSidePanelContent(
      "Edit details",
      <Suspense fallback={<LoadingState />}>
        <EditOrganisationPreferencesForm
          organisationPreferences={organisationPreferences as Preferences}
        />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="General"
        actions={[
          <Button
            key="edit-settings"
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            disabled={isLoading || !organisationPreferences}
            onClick={handleEditOrganisation}
          >
            <span>Edit settings</span>
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && !organisationPreferences && (
          <EmptyState
            title="Could not load general information"
            icon="connected"
            cta={[
              <Button
                key="refetch"
                appearance="positive"
                onClick={handleRefetch}
              >
                Try again
              </Button>,
            ]}
          />
        )}
        {organisationPreferences && (
          <OrganisationPreferences
            organisationPreferences={organisationPreferences}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default GeneralOrganisationSettings;
