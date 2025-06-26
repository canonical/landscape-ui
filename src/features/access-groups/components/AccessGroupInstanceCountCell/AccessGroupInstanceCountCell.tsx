import { useGetInstances } from "@/features/instances";
import { pluralize } from "@/utils/_helpers";
import { Spinner } from "@canonical/react-components";
import { type FC } from "react";
import { Link } from "react-router";
import type { AccessGroupWithInstancesCount } from "../../types/AccessGroup";

interface AccessGroupInstanceCountCellProps {
  readonly accessGroup: AccessGroupWithInstancesCount;
}

const AccessGroupInstanceCountCell: FC<AccessGroupInstanceCountCellProps> = ({
  accessGroup,
}) => {
  const { instancesCount, isGettingInstances } = useGetInstances({
    query: `access-group: ${accessGroup.name}`,
    root_only: false,
    with_alerts: true,
    with_upgrades: true,
    limit: 1,
  });

  if (isGettingInstances) {
    return (
      <>
        <span className="u-off-screen">Loading...</span>
        <Spinner aria-hidden />
      </>
    );
  }

  if (instancesCount) {
    return (
      <Link to={`/instances?accessGroups=${accessGroup.name}`}>
        {instancesCount} {pluralize(instancesCount, "instance")}
      </Link>
    );
  }

  return "0 instances";
};

export default AccessGroupInstanceCountCell;
