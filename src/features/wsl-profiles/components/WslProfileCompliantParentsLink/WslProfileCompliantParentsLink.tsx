import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { WslProfile } from "../../types";
import { ROUTES } from "@/libs/routes";

interface WslProfileCompliantParentsLinkProps {
  readonly wslProfile: WslProfile;
}

const WslProfileCompliantParentsLink: FC<
  WslProfileCompliantParentsLinkProps
> = ({ wslProfile }) => {
  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  const compliantInstanceCount =
    wslProfile.computers.constrained.length -
    wslProfile.computers["non-compliant"].length;

  if (!compliantInstanceCount) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={ROUTES.instances.root({
        query: `profile:wsl:${wslProfile.id}:compliant`,
      })}
    >
      {compliantInstanceCount} {pluralize(compliantInstanceCount, "instance")}
    </StaticLink>
  );
};

export default WslProfileCompliantParentsLink;
