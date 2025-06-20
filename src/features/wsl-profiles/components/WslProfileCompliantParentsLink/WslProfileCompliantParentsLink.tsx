import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { WslProfile } from "../../types";

interface WslProfileCompliantParentsLinkProps {
  readonly wslProfile: WslProfile;
}

const WslProfileCompliantParentsLink: FC<
  WslProfileCompliantParentsLinkProps
> = ({ wslProfile }) => {
  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  if (!wslProfile.computers.compliant?.length) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={{
        pathname: "/instances",
        search: `query=${encodeURIComponent(`profile:wsl:${wslProfile.id}:compliant`)}`,
      }}
    >
      {wslProfile.computers.compliant?.length}{" "}
      {pluralize(wslProfile.computers.compliant?.length, "instance")}
    </StaticLink>
  );
};

export default WslProfileCompliantParentsLink;
