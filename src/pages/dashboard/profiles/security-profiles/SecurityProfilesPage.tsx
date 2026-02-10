import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  SecurityProfilesContainer,
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
} from "@/features/security-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, useState } from "react";

const SecurityProfileAddSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileAddSidePanel,
  })),
);

const SecurityProfileDownloadAuditSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDownloadAuditSidePanel,
  })),
);

const SecurityProfileDuplicateSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDuplicateSidePanel,
  })),
);

const SecurityProfileEditSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileEditSidePanel,
  })),
);

const SecurityProfileRunFixSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileRunFixSidePanel,
  })),
);

const SecurityProfileDetailsSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDetailsSidePanel,
  })),
);

const SecurityProfilesPage: FC = () => {
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);

  const {
    securityProfilesCount: initialSecurityProfilesCount,
    isSecurityProfilesLoading: isInitialSecurityProfilesLoading,
  } = useGetSecurityProfiles({
    offset: 0,
    limit: 0,
  });

  const profileLimitReached = useIsSecurityProfilesLimitReached();

  useSetDynamicFilterValidation("sidePath", [
    "add",
    "download",
    "duplicate",
    "edit",
    "run",
    "view",
  ]);

  const onAddProfile = () => {
    setIsRetentionNotificationVisible(true);
  };

  const openAddSidePanel = createPageParamsSetter({
    sidePath: ["add"],
    profile: "",
  });

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={
          initialSecurityProfilesCount
            ? [
                <Button
                  key="add-security-profile-button"
                  type="button"
                  appearance="positive"
                  onClick={openAddSidePanel}
                  disabled={profileLimitReached}
                >
                  Add security profile
                </Button>,
              ]
            : undefined
        }
      />

      <PageContent hasTable>
        {isInitialSecurityProfilesLoading && <LoadingState />}
        {!isInitialSecurityProfilesLoading &&
          initialSecurityProfilesCount === 0 && (
            <EmptyState
              body={
                <p>
                  Add a security profile to ensure security and complaince
                  across your instances. Security profile audits aggregate audit
                  results over time and in bulk, helping you align with tailored
                  security benchmarks, run scheduled audits, and generate
                  detailed audits for your estate.
                </p>
              }
              cta={[
                <Button
                  key="add-security-profile-button"
                  type="button"
                  appearance="positive"
                  onClick={openAddSidePanel}
                  disabled={profileLimitReached}
                >
                  Add security profile
                </Button>,
              ]}
              title="You don't have any security profiles yet"
            />
          )}
        {!isInitialSecurityProfilesLoading &&
          !!initialSecurityProfilesCount && (
            <SecurityProfilesContainer
              hideRetentionNotification={() => {
                setIsRetentionNotificationVisible(false);
              }}
              retentionNotificationVisible={isRetentionNotificationVisible}
            />
          )}
      </PageContent>

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        isOpen={!!sidePath.length}
        size={lastSidePathSegment === "view" ? "medium" : undefined}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SecurityProfileAddSidePanel onSuccess={onAddProfile} />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "download" && (
          <SidePanel.Suspense key="download">
            <SecurityProfileDownloadAuditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "duplicate" && (
          <SidePanel.Suspense key="duplicate">
            <SecurityProfileDuplicateSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <SecurityProfileEditSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "run" && (
          <SidePanel.Suspense key="run">
            <SecurityProfileRunFixSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <SecurityProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default SecurityProfilesPage;
