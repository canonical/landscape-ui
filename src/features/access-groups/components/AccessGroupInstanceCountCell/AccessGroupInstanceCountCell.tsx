import useInstances from "@/hooks/useInstances";
import { Spinner } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";
import type { AccessGroupWithInstancesCount } from "../../types/AccessGroup";
import classes from "./AccessGroupInstanceCountCell.module.scss";
import { ROUTES } from "@/libs/routes";

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

  if (
    getInstancesQueryResult?.data &&
    accessGroup.instancesCount !== getInstancesQueryResult.data.count
  ) {
    accessGroup.instancesCount = getInstancesQueryResult.data.count || 0;
  }

  if (isPending) {
    return (
      <>
        <span className="u-off-screen">Loading...</span>
        <Spinner aria-hidden />
      </>
    );
  } else if (getInstancesQueryResult?.data.count) {
    return (
      <Link
        className={classes.link}
        to={ROUTES.instances({ accessGroups: [accessGroup.name] })}
      >
        {getInstancesQueryResult.data.count}
      </Link>
    );
  } else {
    return <>0</>;
  }
};

export default AccessGroupInstanceCountCell;
