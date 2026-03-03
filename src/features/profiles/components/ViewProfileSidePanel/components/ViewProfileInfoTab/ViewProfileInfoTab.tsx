import type { FC } from "react";
import type { Profile, ProfileType } from "../../../../types";
import { hasSchedule } from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";
import ViewProfileGeneralBlock from "../ViewProfileGeneralBlock";
import ViewProfileAssociationBlock from "../ViewProfileAssociationBlock";
import ViewProfileScheduleBlock from "../ViewProfileScheduleBlock";
import ViewProfileDetailsBlock from "../ViewProfileDetailsBlock";

interface ViewProfileInfoTabProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ViewProfileInfoTab: FC<ViewProfileInfoTabProps> = ({
  profile,
  type,
}) => {
  return (
    <Blocks>
      <ViewProfileGeneralBlock profile={profile} type={type} />

      <ViewProfileDetailsBlock profile={profile} />

      {hasSchedule(profile) &&
        <ViewProfileScheduleBlock profile={profile} />
      }

      <ViewProfileAssociationBlock profile={profile} type={type} />
    </Blocks>
  );
};

export default ViewProfileInfoTab;
