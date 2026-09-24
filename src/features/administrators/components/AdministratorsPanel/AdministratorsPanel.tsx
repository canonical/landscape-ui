import type { FC } from "react";
import type { Administrator } from "@/features/administrators";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import AdministratorsPanelContent from "../AdministratorsPanelContent";
import { ADMINISTRATORS_DOCUMENTATION_URL } from "@/constants";

interface AdministratorsPanelProps {
  readonly administrators: Administrator[];
  readonly handleInvite: () => void;
}

const AdministratorsPanel: FC<AdministratorsPanelProps> = ({
  administrators,
  handleInvite,
}) => {
  if (!administrators.length) {
    return (
      <EmptyState
        body="There are no administrators in your Landscape organization."
        link={{
          href: ADMINISTRATORS_DOCUMENTATION_URL,
          text: "How to manage administrators in Landscape",
        }}
        cta={[
          <Button
            type="button"
            appearance="positive"
            key="invite-administrator"
            onClick={handleInvite}
          >
            Invite Administrator
          </Button>,
        ]}
        icon="user"
        title="No administrators found"
      />
    );
  }

  return <AdministratorsPanelContent administrators={administrators} />;
};

export default AdministratorsPanel;
