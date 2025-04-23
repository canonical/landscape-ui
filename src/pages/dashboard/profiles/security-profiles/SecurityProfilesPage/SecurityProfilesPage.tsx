import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SecurityProfilesContainer,
  useGetSecurityProfiles,
} from "@/features/security-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";

const SecurityProfileAddForm = lazy(
  async () =>
    import("@/features/security-profiles/components/SecurityProfileAddForm"),
);

const SecurityProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);

  const {
    securityProfilesCount: initialSecurityProfilesCount,
    isSecurityProfilesLoading: isInitialSecurityProfilesLoading,
  } = useGetSecurityProfiles();

  const {
    securityProfilesCount: activeSecurityProfilesCount,
    isSecurityProfilesLoading: isActiveSecurityProfilesLoading,
  } = useGetSecurityProfiles({
    status: "active",
  });

  const showNotification = () => {
    setIsRetentionNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsRetentionNotificationVisible(false);
  };

  const addSecurityProfile = () => {
    setSidePanelContent(
      "Add security profile",
      <Suspense>
        <SecurityProfileAddForm onSuccess={showNotification} />
      </Suspense>,
    );
  };

  if (isInitialSecurityProfilesLoading || isActiveSecurityProfilesLoading) {
    return <LoadingState />;
  }

  const profileLimitReached = activeSecurityProfilesCount >= 5;

  const addButton = (
    <Button
      key="add"
      type="button"
      appearance="positive"
      onClick={addSecurityProfile}
      disabled={profileLimitReached}
    >
      Add security profile
    </Button>
  );

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={initialSecurityProfilesCount ? [addButton] : undefined}
      />

      <PageContent>
        {initialSecurityProfilesCount ? (
          <SecurityProfilesContainer
            hideRetentionNotification={hideNotification}
            profileLimitReached={profileLimitReached}
            retentionNotificationVisible={isRetentionNotificationVisible}
          />
        ) : (
          <EmptyState
            body={
              <p>
                Add a security profile to ensure security and complaince across
                your instances. Security profile audits aggregate audit results
                over time and in bulk, helping you align with tailored security
                benchmarks, run scheduled audits, and generate detailed audits
                for your estate.
              </p>
            }
            cta={[addButton]}
            title="You don't have any security profiles yet"
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
