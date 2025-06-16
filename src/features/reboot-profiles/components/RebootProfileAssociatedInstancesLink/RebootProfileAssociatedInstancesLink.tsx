import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { RebootProfile } from "../../types";

interface RebootProfileAssociatedInstancesLinkProps {
  readonly rebootProfile: RebootProfile;
}

const RebootProfileAssociatedInstancesLink: FC<
  RebootProfileAssociatedInstancesLinkProps
> = ({ rebootProfile }) => {
  if (!rebootProfile.tags.length && !rebootProfile.all_computers) {
    return <NoData />;
  }

  if (!rebootProfile.num_computers) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={{
        pathname: "/instances",
        search: `query=${encodeURIComponent(`profile:reboot:${rebootProfile.id}`)}`,
      }}
    >
      {rebootProfile.num_computers}{" "}
      {pluralize(rebootProfile.num_computers, "instance")}
    </StaticLink>
  );
};

export default RebootProfileAssociatedInstancesLink;
