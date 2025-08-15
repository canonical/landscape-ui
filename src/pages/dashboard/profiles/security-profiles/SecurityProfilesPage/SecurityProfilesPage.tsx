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

const SecurityProfileAddForm = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileAddForm,
  })),
);

const SecurityProfileDownloadAuditForm = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDownloadAuditForm,
  })),
);

const SecurityProfileDuplicateForm = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileDuplicateForm,
  })),
);

const SecurityProfileEditForm = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileEditForm,
  })),
);

const SecurityProfileRunFixForm = lazy(() =>
  import("@/features/security-profiles").then((module) => ({
    default: module.SecurityProfileRunFixForm,
  })),
);

const SecurityProfileDetails = lazy(() =>
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

  const closeSidePanel = () => {
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

      <SidePanel
        onClose={closeSidePanel}
        isOpen={!!action}
        size={action === "view" ? "medium" : undefined}
      >
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <SecurityProfileAddForm onSuccess={onAddProfile} />
          </SidePanel.Suspense>
        )}

        {(action === "download" || action === "view/download") && (
          <SidePanel.Suspense key="download">
            <SecurityProfileDownloadAuditForm
              hasBackButton={action === "view/download"}
            />
          </SidePanel.Suspense>
        )}

        {(action === "duplicate" || action === "view/duplicate") && (
          <SidePanel.Suspense key="duplicate">
            <SecurityProfileDuplicateForm
              hasBackButton={action === "view/duplicate"}
            />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <SecurityProfileEditForm hasBackButton={action === "view/edit"} />
          </SidePanel.Suspense>
        )}

        {(action === "run" || action === "view/run") && (
          <SidePanel.Suspense key="run">
            <SecurityProfileRunFixForm hasBackButton={action === "view/run"} />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <SecurityProfileDetails />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default SecurityProfilesPage;
