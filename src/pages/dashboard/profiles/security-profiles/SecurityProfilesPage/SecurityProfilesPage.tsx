import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SecurityProfileAddForm,
  SecurityProfilesContainer,
} from "@/features/security-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";

const SecurityProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const showNotification = () => {
    setIsNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsNotificationVisible(false);
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
        {isNotificationVisible && (
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
              children: (
                <p>
                  Audits are stored for a maximum of <strong>4 weeks</strong>{" "}
                  and will be automatically removed after{" "}
                  <strong>1 month</strong>. Ensure you download and store
                  necessary records externally to maintain access and
                  compliance.
                </p>
              ),
            }}
          >
            <>
              Audits are stored for a maximum of <strong>4 weeks</strong>. Any
              audit older than 1 month will be automatically removed. We advise
              downloading and storing audits externally before they expire to
              ensure continued access and compliance with your records
              management policies.
            </>
          </IgnorableNotifcation>
        )}

        <SecurityProfilesContainer />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
