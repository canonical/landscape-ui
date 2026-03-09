import { Suspense, useState, type FC } from "react";
import type { Profile, ProfileType } from "../../types";
import ViewProfileActionsBlock from "./components/ViewProfileActionsBlock";
import LoadingState from "@/components/layout/LoadingState";
import { ScriptProfileActivityHistory } from "@/features/script-profiles";
import { Tabs } from "@canonical/react-components";
import ViewProfileInfoTab from "./components/ViewProfileInfoTab";
import classes from "./ViewProfileSidePanel.module.scss";
import { isPackageProfile, isRepositoryProfile, isScriptProfile } from "../../helpers";
import { PackageProfileDetailsConstraints } from "@/features/package-profiles";
import { ViewRepositoryProfileAptSourcesTab } from "@/features/repository-profiles";
import { ViewRepositoryProfilePocketsTab } from "@/features/repository-profiles";
import { getTabs, type TabTypes } from "./helpers";

interface ViewProfileSidePanelProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ViewProfileSidePanel: FC<ViewProfileSidePanelProps> = ({
  profile,
  type,
}) => {
  const [tabId, setTabId] = useState<TabTypes>("info");

  const tabs = getTabs(type);

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  return (
    <>
      <ViewProfileActionsBlock 
        profile={profile}
        type={type}
      />
      <Tabs listClassName={classes.tabs} links={links} />

      <Suspense fallback={<LoadingState />}>
        {tabId == "info" && (
          <ViewProfileInfoTab profile={profile} type={type} key="info" />
        )}

        {isScriptProfile(profile) && tabId == "activity-history" && (
          <ScriptProfileActivityHistory profile={profile} key="activity-history" />
        )}

        {isPackageProfile(profile) && tabId == "package-constraints" && (
          <PackageProfileDetailsConstraints profile={profile} key="package-constraints"/>
        )}

        {isRepositoryProfile(profile) && (
          tabId == "pockets" && (
            <ViewRepositoryProfilePocketsTab profile={profile}  key="pockets" />
          ) || 
          tabId == "apt-sources" && (
            <ViewRepositoryProfileAptSourcesTab profile={profile}  key="apt-sources"/>
          )
        )}
        </Suspense>
    </>
  );
};

export default ViewProfileSidePanel;
