import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { INPUT_DATE_FORMAT } from "@/constants";
import {
  SecurityProfileAddForm,
  SecurityProfilesList,
} from "@/features/security-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  ConfirmationModal,
  Notification,
} from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";

const SecurityProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const add = () => {
    setSidePanelContent(
      "Add security profile",
      <SecurityProfileAddForm
        currentDate={moment().format(`${INPUT_DATE_FORMAT}THH:mm`)}
        showNotification={() => {
          if (!localStorage.getItem("_landscape_isAuditModalIgnored")) {
            setIsNotificationVisible(true);
          }
        }}
      />,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={[
          <Button key="add" type="button" appearance="positive" onClick={add}>
            Add security profile
          </Button>,
        ]}
      />
      <PageContent>
        {isNotificationVisible && (
          <Notification
            title="Audit retention policy:"
            inline
            onDismiss={() => {
              setIsModalVisible(true);
            }}
          >
            Audits are stored for a maximum of <strong>4 weeks</strong>. Any
            audit older than 1 month will be automatically removed. We advise
            downloading and storing audits externally before they expire to
            ensure continued access and compliance with your records management
            policies.
          </Notification>
        )}

        <SecurityProfilesList />

        {isModalVisible && (
          <ConfirmationModal
            title="Dismiss audit retention acknowledgment"
            confirmButtonLabel="Dismiss"
            confirmButtonAppearance="positive"
            onConfirm={() => {
              setIsModalVisible(false);
              setIsNotificationVisible(false);

              if (isChecked) {
                localStorage.setItem("_landscape_isAuditModalIgnored", "true");
              }
            }}
            close={() => {
              setIsModalVisible(false);
              setIsChecked(false);
            }}
          >
            <p>
              Audits are stored for a maximum of <strong>4 weeks</strong> and
              will be automatically removed after <strong>1 month</strong>.
              Ensure you download and store necessary records externally to
              maintain access and compliance.
            </p>

            <CheckboxInput
              label="I understand and acknowledge this policy. Don't show this message again."
              checked={isChecked}
              onChange={() => {
                setIsChecked((value) => !value);
              }}
            />
          </ConfirmationModal>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
