import NoData from "@/components/layout/NoData";
import StaticLink from "@/components/layout/StaticLink";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import type { SecurityProfile } from "../../types";

interface SecurityProfileAssociatedInstancesLinkProps {
  readonly securityProfile: SecurityProfile;
}

const SecurityProfileAssociatedInstancesLink: FC<
  SecurityProfileAssociatedInstancesLinkProps
> = ({ securityProfile }) => {
  if (!securityProfile.tags.length && !securityProfile.all_computers) {
    return <NoData />;
  }

  if (!securityProfile.associated_instances) {
    return "0 instances";
  }

  return (
    <StaticLink
      to={{
        pathname: "/instances",
        search: `query=${encodeURIComponent(`profile:security:${securityProfile.id}`)}`,
      }}
    >
      {securityProfile.associated_instances}{" "}
      {pluralize(securityProfile.associated_instances, "instance")}
    </StaticLink>
  );
};

export default SecurityProfileAssociatedInstancesLink;
