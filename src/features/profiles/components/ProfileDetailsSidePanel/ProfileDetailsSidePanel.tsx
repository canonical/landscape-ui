import SidePanel from "@/components/layout/SidePanel";
import type { FC } from "react";
import type { Profile, ProfileType } from "../../types";
import { hasSchedule } from "../../helpers";
import type { Action } from "@/types/Action";
import ProfileDetailsGeneralBlock from "./components/ProfileDetailsGeneralBlock";
import ProfileDetailsAssociationBlock from "./components/ProfileDetailsAssociationBlock";
import ProfileDetailsScheduleBlock from "./components/ProfileDetailsScheduleBlock";
import ProfileDetailsActionsBlock from "./components/ProfileDetailsActionsBlock/ProfileDetailsActionsBlock";
import Blocks from "@/components/layout/Blocks";

interface ProfileDetailsSidePanelProps {
  readonly profile: Profile;
  readonly type: ProfileType;
  readonly extraActions: Action[];
}

const ProfileDetailsSidePanel: FC<ProfileDetailsSidePanelProps> = ({
  profile,
  type,
  extraActions,
}) => {
  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <ProfileDetailsActionsBlock 
          profile={profile}
          type={type}
          extraActions={extraActions}
        />
        <Blocks>
          <ProfileDetailsGeneralBlock profile={profile} type={type} />

          {hasSchedule(profile) &&
            <ProfileDetailsScheduleBlock profile={profile} />
          }

          <ProfileDetailsAssociationBlock profile={profile} type={type} />
        </Blocks>
      </SidePanel.Content>
    </>
  );
};

export default ProfileDetailsSidePanel;
