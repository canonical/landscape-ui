import useInstances from "@/hooks/useInstances";
import { pluralize } from "@/utils/_helpers";
import { Spinner } from "@canonical/react-components";
import { type FC } from "react";
import { Link } from "react-router";
import type { AccessGroupWithInstancesCount } from "../../types/AccessGroup";
import classes from "./AccessGroupInstanceCountCell.module.scss";

interface AccessGroupInstanceCountCellProps {
  readonly accessGroup: AccessGroupWithInstancesCount;
}

const AccessGroupInstanceCountCell: FC<AccessGroupInstanceCountCellProps> = ({
  accessGroup,
}) => {
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isPending } = getInstancesQuery({
    query: `access-group: ${accessGroup.name}`,
    root_only: false,
    with_alerts: true,
    with_upgrades: true,
    limit: 1,
  });

  if (isPending) {
    return (
      <>
        <span className="u-off-screen">Loading...</span>
        <Spinner aria-hidden />
      </>
    );
  }

  const count = getInstancesQueryResult?.data.count;

  if (count) {
    return (
      <Link
        className={classes.link}
        to={`/instances?accessGroups=${accessGroup.name}`}
      >
        {count} {pluralize(count, "instance")}
      </Link>
    );
  }

  return "0 instances";
};

export default AccessGroupInstanceCountCell;
