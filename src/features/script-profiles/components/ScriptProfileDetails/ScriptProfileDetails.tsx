import { Tabs } from "@canonical/react-components";
import { useState, type FC } from "react";
import type { ScriptProfile } from "../../types";
import ScriptProfileActivityHistory from "../ScriptProfileActivityHistory";
import ScriptProfileControl from "../ScriptProfileControl";
import ScriptProfileInfo from "../ScriptProfileInfo";

interface ScriptProfileDetailsProps {
  readonly actions: {
    archive: () => void;
    edit: () => void;
    viewDetails: () => void;
  };
  readonly profile: ScriptProfile;
}

const ScriptProfileDetails: FC<ScriptProfileDetailsProps> = ({
  actions,
  profile,
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
      <ScriptProfileControl actions={actions} profile={profile} />
      <Tabs listClassName="u-no-margin--bottom" links={links} />

      {tabId == "info" && <ScriptProfileInfo profile={profile} />}

      {tabId == "activity-history" && (
        <ScriptProfileActivityHistory profile={profile} />
      )}
    </>
  );
};

export default ScriptProfileDetails;
