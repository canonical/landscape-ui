import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  ACTIVITY_STATUSES,
  ActivityDetailsLink,
  type ActivityCommon,
} from "@/features/activities";
import { ModularTable } from "@canonical/react-components";
import date from "@/libs/date";
import { type FC, useMemo } from "react";
import type { CellProps, Column } from "react-table";

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
          <ActivityDetailsLink
            activity={activity}
            isActivityGroup
            className="font-monospace"
          >
            {date(activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}
          </ActivityDetailsLink>
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
