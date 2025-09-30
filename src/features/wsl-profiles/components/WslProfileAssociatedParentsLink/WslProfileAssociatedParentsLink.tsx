import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { WslProfile } from "../../types";
import { ROUTES } from "@/libs/routes";

interface WslProfileAssociatedParentsLinkProps {
  readonly wslProfile: WslProfile;
}

const WslProfileAssociatedParentsLink: FC<
  WslProfileAssociatedParentsLinkProps
> = ({ wslProfile }) => {
  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  if (!wslProfile.computers.constrained.length) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={ROUTES.instances.root({
        query: `profile:wsl:${wslProfile.id}`,
      })}
    >
      {wslProfile.computers.constrained.length}{" "}
      {pluralize(wslProfile.computers.constrained.length, "instance")}
    </StaticLink>
  );
};

export default WslProfileAssociatedParentsLink;
