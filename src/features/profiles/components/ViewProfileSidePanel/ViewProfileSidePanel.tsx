import { Suspense, useState, type FC } from "react";
import ViewProfileActionsBlock from "./components/ViewProfileActionsBlock";
import LoadingState from "@/components/layout/LoadingState";
import { ScriptProfileActivityHistory } from "@/features/script-profiles";
import { Tabs } from "@canonical/react-components";
import ViewProfileInfoTab from "./components/ViewProfileInfoTab";
import classes from "./ViewProfileSidePanel.module.scss";
import { isPackageProfile, isScriptProfile } from "../../helpers";
import { PackageProfileDetailsConstraints } from "@/features/package-profiles";
import { getTabs, type TabTypes } from "./helpers";
import type { Profile } from "../../types";
import type { ProfileTypes } from "../../helpers";
import { hasOneItem } from "@/utils/_helpers";
import SidePanel from "@/components/layout/SidePanel";

interface ViewProfileSidePanelProps {
  readonly profile: Profile | undefined;
  readonly type: ProfileTypes;
}

const ViewProfileSidePanel: FC<ViewProfileSidePanelProps> = ({
  profile,
  type,
}) => {
  const [tabId, setTabId] = useState<TabTypes>("info");

  if (!profile) {
    return <SidePanel.LoadingState />;
  }

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
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <ViewProfileActionsBlock profile={profile} type={type} />
        {hasOneItem(tabs) ? (
          <ViewProfileInfoTab profile={profile} type={type} key="info" />
        ) : (
          <>
            <Tabs listClassName={classes.tabs} links={links} />

            <Suspense fallback={<LoadingState />}>
              {tabId === "info" && (
                <ViewProfileInfoTab profile={profile} type={type} key="info" />
              )}

              {isScriptProfile(profile) && tabId === "activity-history" && (
                <ScriptProfileActivityHistory
                  profile={profile}
                  key="activity-history"
                />
              )}

              {isPackageProfile(profile) && tabId === "package-constraints" && (
                <PackageProfileDetailsConstraints
                  profile={profile}
                  key="package-constraints"
                />
              )}
            </Suspense>
          </>
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewProfileSidePanel;
