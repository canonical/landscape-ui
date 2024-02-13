import { FC, Suspense, useState } from "react";
import { Tabs } from "@canonical/react-components";
import classes from "../../instances/[single]/SingleInstance.module.scss";
import LoadingState from "../../../../components/layout/LoadingState";
import AdministratorsPanel from "./tabs/administrators";
import InvitesPanel from "./tabs/invites";

const tabLinks = [
  {
    label: "Administrators",
    id: "tab-link-administrators",
  },
  {
    label: "Invites",
    id: "tab-link-invites",
  },
];

const AdministratorsContainer: FC = () => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState(
    "tab-link-administrators",
  );

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabLinks.map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => setCurrentTabLinkId(id),
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
            <AdministratorsPanel />
          )}
          {"tab-link-invites" === currentTabLinkId && <InvitesPanel />}
        </Suspense>
      </div>
    </>
  );
};

export default AdministratorsContainer;
