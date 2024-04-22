import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { OrganisationPreferences } from "@/features/organisation-settings";
import useDebug from "@/hooks/useDebug";
import { useOrgSettings } from "@/hooks/useOrgSettings";
import useSidePanel from "@/hooks/useSidePanel";
import { Preferences } from "@/types/Preferences";
import { Button } from "@canonical/react-components";
import { FC, Suspense, lazy } from "react";

const EditOrganisationForm = lazy(
  () =>
    import("@/features/organisation-settings/EditOrganisationPreferencesForm"),
);

const GeneralOrganisationSettings: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const debug = useDebug();
  const { getOrganisationPreferences } = useOrgSettings();
  const {
    data: orgPreferencesData,
    isLoading,
    error,
    refetch,
  } = getOrganisationPreferences();
  const organisationPreferences = orgPreferencesData?.data;

  if (error) {
    debug(error);
  }

  const handleRefetch = () => {
    refetch();
  };

  const handleEditOrganisation = () => {
    setSidePanelContent(
      "Edit details",
      <Suspense fallback={<LoadingState />}>
        <EditOrganisationForm
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
