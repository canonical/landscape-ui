import SidePanel from "@/components/layout/SidePanel";
import { Tabs } from "@canonical/react-components";
import { useState, type FC } from "react";
import ScriptProfileActivityHistory from "../ScriptProfileActivityHistory";
import ScriptProfileControl from "../ScriptProfileControl";
import ScriptProfileInfo from "../ScriptProfileInfo";
import type { ScriptProfileSidePanelComponentProps } from "../ScriptProfileSidePanel";
import ScriptProfileSidePanel from "../ScriptProfileSidePanel";
import classes from "./ScriptProfileDetailsSidePanel.module.scss";

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

        {tabId == "info" && <ScriptProfileInfo profile={profile} />}

        {tabId == "activity-history" && (
          <ScriptProfileActivityHistory profile={profile} />
        )}
      </SidePanel.Content>
    </>
  );
};

const ScriptProfileDetailsSidePanel: FC = () => (
  <ScriptProfileSidePanel Component={Component} />
);

export default ScriptProfileDetailsSidePanel;
