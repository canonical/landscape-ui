import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { Tabs } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useGetScriptProfile } from "../../api";
import ScriptProfileActivityHistory from "../ScriptProfileActivityHistory";
import ScriptProfileControl from "../ScriptProfileControl";
import ScriptProfileInfo from "../ScriptProfileInfo";
import classes from "./ScriptProfileDetails.module.scss";

const ScriptProfileDetails: FC = () => {
  const { scriptProfile: scriptProfileId } = usePageParams();

  const {
    scriptProfile: profile,
    isGettingScriptProfile,
    scriptProfileError,
  } = useGetScriptProfile({
    id: scriptProfileId,
  });

  const [tabId, setTabId] = useState<"info" | "activity-history">("info");

  if (isGettingScriptProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!profile) {
    throw scriptProfileError;
  }

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
    <SidePanel.Body title={profile.title}>
      <ScriptProfileControl profile={profile} />
      <Tabs listClassName={classes.tabs} links={links} />

      {tabId == "info" && <ScriptProfileInfo profile={profile} />}

      {tabId == "activity-history" && (
        <ScriptProfileActivityHistory profile={profile} />
      )}
    </SidePanel.Body>
  );
};

export default ScriptProfileDetails;
