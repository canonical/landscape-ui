import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  AddSecurityProfileButton,
  SecurityProfilesContainer,
  useGetSecurityProfiles,
} from "@/features/security-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { Fragment, lazy, useState } from "react";

const SecurityProfileAddSidePanel = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileAddForm,
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
    default: module.SecurityProfileDetails,
  })),
);

const SecurityProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);

  const {
    securityProfilesCount: initialSecurityProfilesCount,
    isSecurityProfilesLoading: isInitialSecurityProfilesLoading,
  } = useGetSecurityProfiles({
    offset: 0,
    limit: 0,
  });

  useSetDynamicFilterValidation("action", [
    "add",
    "download",
    "duplicate",
    "edit",
    "run",
    "view",
    "view/download",
    "view/duplicate",
    "view/edit",
    "view/run",
  ]);

  const close = () => {
    setPageParams({ action: "", securityProfile: -1 });
  };

  const onAddProfile = () => {
    setIsRetentionNotificationVisible(true);
  };

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={
          initialSecurityProfilesCount
            ? [
                <Fragment key="add-security-profile-button">
                  <AddSecurityProfileButton />
                </Fragment>,
              ]
            : undefined
        }
      />

      <PageContent>
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
                <Fragment key="add-security-profile-button">
                  <AddSecurityProfileButton />
                </Fragment>,
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

      {action === "add" && (
        <SidePanel close={close} key="add">
          <SecurityProfileAddSidePanel onSuccess={onAddProfile} />
        </SidePanel>
      )}

      {(action === "download" || action === "view/download") && (
        <SidePanel close={close} key="download">
          <SecurityProfileDownloadAuditSidePanel
            hasBackButton={action === "view/download"}
          />
        </SidePanel>
      )}

      {(action === "duplicate" || action === "view/duplicate") && (
        <SidePanel close={close} key="duplicate">
          <SecurityProfileDuplicateSidePanel
            hasBackButton={action === "view/duplicate"}
          />
        </SidePanel>
      )}

      {(action === "edit" || action === "view/edit") && (
        <SidePanel close={close} key="edit">
          <SecurityProfileEditSidePanel
            hasBackButton={action === "view/edit"}
          />
        </SidePanel>
      )}

      {(action === "run" || action === "view/run") && (
        <SidePanel close={close} key="run">
          <SecurityProfileRunFixSidePanel
            hasBackButton={action === "view/run"}
          />
        </SidePanel>
      )}

      {action === "view" && (
        <SidePanel close={close} key="view" size="medium">
          <SecurityProfileDetailsSidePanel />
        </SidePanel>
      )}
    </PageMain>
  );
};

export default SecurityProfilesPage;
