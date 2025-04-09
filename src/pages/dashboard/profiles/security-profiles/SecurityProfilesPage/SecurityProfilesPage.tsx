import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SecurityProfileAddForm,
  SecurityProfilesContainer,
} from "@/features/security-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";

const SecurityProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

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
      <SecurityProfileAddForm onSuccess={showNotification} />,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={[
          <Button
            key="add"
            type="button"
            appearance="positive"
            onClick={addSecurityProfile}
          >
            Add security profile
          </Button>,
        ]}
      />

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

        <SecurityProfilesContainer />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
