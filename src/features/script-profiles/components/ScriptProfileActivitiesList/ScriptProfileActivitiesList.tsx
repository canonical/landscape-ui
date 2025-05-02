import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES, type Activity } from "@/features/activities";
import { ModularTable } from "@canonical/react-components";
import moment from "moment";
import { useMemo, type FC } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import classes from "./ScriptProfileActivitiesList.module.scss";

interface ScriptProfileActivitiesListProps {
  readonly activities: Activity[];
}

const ScriptProfileActivitiesList: FC<ScriptProfileActivitiesListProps> = ({
  activities,
}) => {
  const columns = useMemo<Column<Activity>[]>(
    () => [
      {
        Header: "Run",
        Cell: ({ row: { original: activity } }: CellProps<Activity>) => (
          <Link
            className={classes.link}
            to={`/activities?query=parent-id%3A${activity.id}`}
          >
            {moment(activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
          </Link>
        ),
      },

      {
        Header: "Status",
        Cell: ({ row: { original: activity } }: CellProps<Activity>) =>
          ACTIVITY_STATUSES[activity.activity_status].label,
        getCellIcon: ({ row: { original: activity } }: CellProps<Activity>) =>
          ACTIVITY_STATUSES[activity.activity_status].icon,
      },
    ],
    [activities],
  );

  return <ModularTable columns={columns} data={activities} />;
};

export default ScriptProfileActivitiesList;
