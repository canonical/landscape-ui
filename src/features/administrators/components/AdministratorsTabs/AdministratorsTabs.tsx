import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import AdministratorsPanel from "../AdministratorsPanel";
import InvitesPanel from "../InvitesPanel";
import { Badge, Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { Suspense, useState } from "react";
import classes from "./AdministratorsTabs.module.scss";
import type { Administrator } from "../../types";

interface AdministratorsTabsProps {
  readonly administrators: Administrator[];
  readonly invitationsCount?: number;
  readonly handleInvite: () => void;
}

const AdministratorsTabs: FC<AdministratorsTabsProps> = ({
  administrators,
  invitationsCount,
  handleInvite,
}) => {
  const { closeSidePanel } = useSidePanel();

  const [currentTabLinkId, setCurrentTabLinkId] = useState(
    "tab-link-administrators",
  );

  const tabLinks = [
    {
      label: "Administrators",
      id: "tab-link-administrators",
    },
    {
      label: (
        <>
          <span>Invites</span>
          {!!invitationsCount && <Badge value={invitationsCount} />}
        </>
      ),
      id: "tab-link-invites",
    },
  ];

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabLinks.map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => {
            setCurrentTabLinkId(id);
            closeSidePanel();
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTabLinkId}
        className={classes.tabPanel}
      >
        <Suspense fallback={<LoadingState />}>
          {"tab-link-administrators" === currentTabLinkId && (
            <AdministratorsPanel
              administrators={administrators}
              handleInvite={handleInvite}
            />
          )}
          {"tab-link-invites" === currentTabLinkId && <InvitesPanel />}
        </Suspense>
      </div>
    </>
  );
};

export default AdministratorsTabs;
