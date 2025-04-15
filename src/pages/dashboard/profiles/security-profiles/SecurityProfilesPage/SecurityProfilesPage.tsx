import EmptyState from "@/components/layout/EmptyState";
import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SecurityProfilesHeader,
  SecurityProfilesList,
  useGetSecurityProfiles,
} from "@/features/security-profiles";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";

const SecurityProfileAddForm = lazy(
  async () =>
    import("@/features/security-profiles/components/SecurityProfileAddForm"),
);

const SecurityProfilesPage: FC = () => {
  const { currentPage, pageSize, search, statuses } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      search,
      statuses: statuses.length === 0 ? [] : statuses,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const [isRetentionNotificationVisible, setIsRetentionNotificationVisible] =
    useState(false);

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

  if (isSecurityProfilesLoading) {
    return <LoadingState />;
  }

  const addButton = (
    <Button
      key="add"
      type="button"
      appearance="positive"
      onClick={addSecurityProfile}
    >
      Add security profile
    </Button>
  );

  if (!securityProfiles.length && !search && !statuses.length) {
    return (
      <PageMain>
        <PageHeader title="Security profiles" />
        <EmptyState
          body={
            <p>
              Add a security profile to ensure security and complaince across
              your instances. Security profile audits aggregate audit results
              over time and in bulk, helping you align with tailored security
              benchmarks, run scheduled audits, and generate detailed audits for
              your estate.
            </p>
          }
          cta={[addButton]}
          title="You don't have any security profiles yet"
        />
        );
      </PageMain>
    );
  }

  return (
    <PageMain>
      <PageHeader title="Security profiles" actions={[addButton]} />

      <PageContent>
        {isRetentionNotificationVisible && (
          <IgnorableNotifcation
            inline
            title="Audit retention policy:"
            storageKey="_landscape_isAuditModalIgnored"
            hide={hideNotification}
            modalProps={{
              title: "Dismiss audit retention acknowledgment",
              confirmButtonAppearance: "positive",
              confirmButtonLabel: "Dismiss",
              checkboxProps: {
                label:
                  "I understand and acknowledge this policy. Don't show this message again.",
              },
            }}
          >
            <>
              Any audit older than the specified retention period for a given
              profile will be automatically removed. We recommend downloading
              and storing audit data externally before it expires. You can view
              the exact retention period for each profile in its details.
            </>
          </IgnorableNotifcation>
        )}

        <Notification inline title="Your audit is ready for download:">
          Your audit has been successfully generated and is now ready for
          download.{" "}
          <Button type="button" appearance="link" onClick={() => undefined}>
            Download audit
          </Button>
        </Notification>

        <SecurityProfilesHeader />
        <SecurityProfilesList securityProfiles={securityProfiles} />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
