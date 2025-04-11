import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ActivityDetails, type Activity } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import moment from "moment";
import { Suspense, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";

interface ScriptProfileActivitiesListProps {
  readonly activities: Activity[];
}

const ScriptProfileActivitiesList: FC<ScriptProfileActivitiesListProps> = ({
  activities,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const columns = useMemo<Column<Activity>[]>(
    () => [
      {
        Header: "Run",
        Cell: ({ row: { original: activity } }: CellProps<Activity>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin u-no-padding--top"
            onClick={() => {
              setSidePanelContent(
                activity.summary,
                <Suspense fallback={<LoadingState />}>
                  <ActivityDetails activityId={activity.id} />
                </Suspense>,
              );
            }}
          >
            {moment(activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
            GMT
          </Button>
        ),
      },
    ],
    [],
  );

  return <ModularTable columns={columns} data={activities} />;
};

export default ScriptProfileActivitiesList;
