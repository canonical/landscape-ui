import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ActivityDetails, type Activity } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import { Tabs } from "@canonical/react-components";
import moment from "moment";
import { Suspense, useState, type FC } from "react";
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
  const { setSidePanelContent } = useSidePanel();

  const [tabId, setTabId] = useState<"info" | "activity-history">("info");

  const viewActivityDetails = (activity: Activity) => {
    setSidePanelContent(
      `${profile.title} - ${moment(activity.creation_time).format(DISPLAY_DATE_TIME_FORMAT)}`,
      <Suspense fallback={<LoadingState />}>
        <>
          <ActivityDetails activityId={activity.id} />
          <SidePanelFormButtons
            hasActionButtons={false}
            hasBackButton={true}
            onBackButtonPress={actions.viewDetails}
          />
        </>
      </Suspense>,
    );
  };

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

      {tabId == "info" && (
        <ScriptProfileInfo
          goBack={actions.viewDetails}
          profile={profile}
          viewActivityDetails={viewActivityDetails}
        />
      )}

      {tabId == "activity-history" && (
        <ScriptProfileActivityHistory
          profile={profile}
          viewActivityDetails={viewActivityDetails}
        />
      )}
    </>
  );
};

export default ScriptProfileDetails;
