import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { PackageProfile } from "../../types";
import { ROUTES } from "@/libs/routes";

interface PackageProfileAssociatedInstancesLinkProps {
  readonly packageProfile: PackageProfile;
}

const PackageProfileAssociatedInstancesLink: FC<
  PackageProfileAssociatedInstancesLinkProps
> = ({ packageProfile: packageProfile }) => {
  if (!packageProfile.tags.length && !packageProfile.all_computers) {
    return <NoData />;
  }

  if (!packageProfile.computers.constrained.length) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={ROUTES.instances.root({
        query: `profile:package:${packageProfile.id}`,
      })}
    >
      {packageProfile.computers.constrained.length}{" "}
      {pluralize(packageProfile.computers.constrained.length, "instance")}
    </StaticLink>
  );
};

export default PackageProfileAssociatedInstancesLink;
