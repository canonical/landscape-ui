import AppTabs from "@/components/AppTabs";
import SidePanel from "@/components/layout/SidePanel";
import { PackageProfileDetailsConstraints } from "@/features/package-profiles";
import { ScriptProfileActivityHistory } from "@/features/script-profiles";
import { hasOneItem } from "@/utils/_helpers";
import type { FC, ReactNode } from "react";
import type { ProfileTypes } from "../../helpers";
import { isPackageProfile, isScriptProfile } from "../../helpers";
import type { Profile } from "../../types";
import ViewProfileActionsBlock from "./components/ViewProfileActionsBlock";
import ViewProfileInfoTab from "./components/ViewProfileInfoTab";
import { getTabs, type TabTypes } from "./helpers";

interface ViewProfileSidePanelProps {
  readonly profile: Profile | undefined;
  readonly type: ProfileTypes;
}

const ViewProfileSidePanel: FC<ViewProfileSidePanelProps> = ({
  profile,
  type,
}) => {
  if (!profile) {
    return <SidePanel.LoadingState />;
  }

  const tabs = getTabs(type);

  const panels: Partial<Record<TabTypes, ReactNode>> = {
    info: <ViewProfileInfoTab profile={profile} type={type} key="info" />,
    "activity-history": isScriptProfile(profile) ? (
      <ScriptProfileActivityHistory profile={profile} key="activity-history" />
    ) : undefined,
    "package-constraints": isPackageProfile(profile) ? (
      <PackageProfileDetailsConstraints
        profile={profile}
        key="package-constraints"
      />
    ) : undefined,
  };

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <ViewProfileActionsBlock profile={profile} type={type} />
        {hasOneItem(tabs) ? (
          <ViewProfileInfoTab profile={profile} type={type} key="info" />
        ) : (
          <AppTabs<TabTypes>
            aria-label="Profile details"
            slot="panel"
            items={tabs.map(({ id, label }) => ({
              id,
              label,
              panel: panels[id],
            }))}
          />
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewProfileSidePanel;
