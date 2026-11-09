import AppTabs from "@/components/AppTabs";
import { Badge } from "@canonical/react-ds-global";
import type { FC } from "react";
import type { Administrator } from "../../types";
import AdministratorsPanel from "../AdministratorsPanel";
import InvitesPanel from "../InvitesPanel";

interface AdministratorsTabsProps {
  readonly administrators: Administrator[];
  readonly invitationsCount?: number;
  readonly handleInvite: () => void;
}

const AdministratorsTabs: FC<AdministratorsTabsProps> = ({
  administrators,
  invitationsCount,
  handleInvite,
}) => (
  <AppTabs
    aria-label="Administrator settings"
    items={[
      {
        id: "administrators",
        label: "Administrators",
        panel: (
          <AdministratorsPanel
            administrators={administrators}
            handleInvite={handleInvite}
          />
        ),
      },
      {
        id: "invites",
        label: "Invites",
        labelContent: invitationsCount ? (
          <>
            <span>Invites</span>
            <Badge value={invitationsCount} />
          </>
        ) : undefined,
        panel: <InvitesPanel />,
      },
    ]}
  />
);

export default AdministratorsTabs;
