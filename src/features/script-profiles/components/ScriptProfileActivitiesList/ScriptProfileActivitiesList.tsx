import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES, type ActivityCommon } from "@/features/activities";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import { useMemo, type FC } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import classes from "./ScriptProfileActivitiesList.module.scss";

interface ScriptProfileActivitiesListProps {
  readonly activities: ActivityCommon[];
}

const ScriptProfileActivitiesList: FC<ScriptProfileActivitiesListProps> = ({
  activities,
}) => {
  const columns = useMemo<Column<ActivityCommon>[]>(
    () => [
      {
        Header: "Run",
        accessor: "creation_time",
        Cell: ({ row: { original: activity } }: CellProps<ActivityCommon>) => (
          <Link
            className={`${classes.link} font-monospace`}
            to={`/activities?query=parent-id%3A${activity.id}`}
          >
            {moment(activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}
          </Link>
        ),
      },
      {
        Header: "Status",
        accessor: "activity_status",
        Cell: ({ row: { original: activity } }: CellProps<ActivityCommon>) =>
          ACTIVITY_STATUSES[activity.activity_status].label,
        getCellIcon: ({
          row: { original: activity },
        }: CellProps<ActivityCommon>) =>
          ACTIVITY_STATUSES[activity.activity_status].icon,
      },
    ],
    [activities],
  );

  return <ModularTable columns={columns} data={activities} />;
};

export default ScriptProfileActivitiesList;
