import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import NoData from "@/components/layout/NoData";
import type { FC } from "react";
import type { ScriptProfile } from "../../types";

interface ScriptProfileAssociatedInstancesLinkProps {
  readonly scriptProfile: ScriptProfile;
}

const ScriptProfileAssociatedInstancesLink: FC<
  ScriptProfileAssociatedInstancesLinkProps
> = ({ scriptProfile }) => {
  if (
    scriptProfile.trigger.trigger_type === "event" &&
    scriptProfile.trigger.event_type === "post_enrollment"
  ) {
    return <NoData />;
  } else {
    return (
      <ProfileAssociatedInstancesLink
        count={scriptProfile.computers.num_associated_computers}
        profile={scriptProfile}
        query={`script:${scriptProfile.id}`}
      />
    );
  }
};

export default ScriptProfileAssociatedInstancesLink;
