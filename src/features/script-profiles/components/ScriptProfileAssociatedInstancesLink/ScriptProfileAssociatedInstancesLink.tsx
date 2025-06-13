import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { ScriptProfile } from "../../types";

interface ScriptProfileAssociatedInstancesLinkProps {
  readonly scriptProfile: ScriptProfile;
}

const ScriptProfileAssociatedInstancesLink: FC<
  ScriptProfileAssociatedInstancesLinkProps
> = ({ scriptProfile }) => {
  if (!scriptProfile.tags.length && !scriptProfile.all_computers) {
    return <NoData />;
  }

  if (
    scriptProfile.trigger.trigger_type === "event" &&
    scriptProfile.trigger.event_type === "post_enrollment"
  ) {
    return <NoData />;
  }

  if (!scriptProfile.computers.num_associated_computers) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={{
        pathname: "/instances",
        search: `query=${encodeURIComponent(`profile:script:${scriptProfile.id}`)}`,
      }}
    >
      {scriptProfile.computers.num_associated_computers}{" "}
      {pluralize(scriptProfile.computers.num_associated_computers, "instance")}
    </StaticLink>
  );
};

export default ScriptProfileAssociatedInstancesLink;
