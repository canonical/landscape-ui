import type { FC } from "react";
import type { Administrator } from "@/features/administrators";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import useSidePanel from "@/hooks/useSidePanel";
import AdministratorsPanelContent from "../AdministratorsPanelContent";
import { ADMINISTRATORS_DOCUMENTATION_URL } from "@/constants";

const InviteAdministratorForm = lazy(
  () => import("../InviteAdministratorForm"),
);

interface AdministratorsPanelProps {
  readonly administrators: Administrator[];
}

const AdministratorsPanel: FC<AdministratorsPanelProps> = ({
  administrators,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleInviteAdministrator = () => {
    setSidePanelContent(
      "Invite administrator",
      <Suspense fallback={<LoadingState />}>
        <InviteAdministratorForm />
      </Suspense>,
    );
  };

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
            onClick={handleInviteAdministrator}
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
