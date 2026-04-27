import { lazy, type FC } from "react";
import type { Profile } from "../../../../types";
import { hasSchedule, type ProfileTypes } from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";
import ViewProfileGeneralBlock from "../ViewProfileGeneralBlock";
import ViewProfileAssociationBlock from "../ViewProfileAssociationBlock";
import ViewProfileDetailsBlock from "../ViewProfileDetailsBlock";

const ViewProfileScheduleBlock = lazy(
  async () => import("../ViewProfileScheduleBlock"),
);

interface ViewProfileInfoTabProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

const ViewProfileInfoTab: FC<ViewProfileInfoTabProps> = ({ profile, type }) => {
  return (
    <Blocks>
      <ViewProfileGeneralBlock type={type} profile={profile} />

      <ViewProfileDetailsBlock profile={profile} />

      {hasSchedule(type) && <ViewProfileScheduleBlock profile={profile} />}

      <ViewProfileAssociationBlock type={type} profile={profile} />
    </Blocks>
  );
};

export default ViewProfileInfoTab;
