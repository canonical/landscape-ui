import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES, type Activity } from "@/features/activities";
import { Button, ModularTable } from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./ScriptProfileActivitiesList.module.scss";

interface ScriptProfileActivitiesListProps {
  readonly activities: Activity[];
  readonly viewActivityDetails: (activity: Activity) => void;
}

const ScriptProfileActivitiesList: FC<ScriptProfileActivitiesListProps> = ({
  activities,
  viewActivityDetails,
}) => {
  const columns = useMemo<Column<Activity>[]>(
    () => [
      {
        Header: "Run",
        Cell: ({ row: { original: activity } }: CellProps<Activity>) => (
          <Button
            type="button"
            appearance="link"
            className={classNames(
              "u-no-margin u-no-padding--top",
              classes.link,
            )}
            onClick={() => {
              viewActivityDetails(activity);
            }}
          >
            {moment(activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
          </Button>
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
