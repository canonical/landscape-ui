import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { Tabs } from "@canonical/react-components";
import { lazy, Suspense, useState, type FC } from "react";
import ScriptProfileControl from "../ScriptProfileControl";
import type { ScriptProfileSidePanelComponentProps } from "../ScriptProfileSidePanel";
import ScriptProfileSidePanel from "../ScriptProfileSidePanel";
import classes from "./ScriptProfileDetails.module.scss";

const ScriptProfileActivityHistory = lazy(
  () => import("../ScriptProfileActivityHistory"),
);

const ScriptProfileInfo = lazy(() => import("../ScriptProfileInfo"));

const Component: FC<ScriptProfileSidePanelComponentProps> = ({
  scriptProfile: profile,
}) => {
  const [tabId, setTabId] = useState<"info" | "activity-history">("info");

  const tabs: { label: string; id: typeof tabId }[] = [
    {
      label: "Info",
      id: "info",
    },
    {
      label: "Activity history",
      id: "activity-history",
    },
  ];

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <ScriptProfileControl profile={profile} />
        <Tabs listClassName={classes.tabs} links={links} />

        {tabId == "info" && (
          <Suspense fallback={<LoadingState />} key="info">
            <ScriptProfileInfo profile={profile} />
          </Suspense>
        )}

        {tabId == "activity-history" && (
          <Suspense fallback={<LoadingState />} key="activity-history">
            <ScriptProfileActivityHistory profile={profile} />
          </Suspense>
        )}
      </SidePanel.Content>
    </>
  );
};

const ScriptProfileDetailsSidePanel: FC = () => (
  <ScriptProfileSidePanel Component={Component} />
);

export default ScriptProfileDetailsSidePanel;
