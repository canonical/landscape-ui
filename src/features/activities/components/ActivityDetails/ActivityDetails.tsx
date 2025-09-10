import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstance } from "@/features/instances";
import { CodeSnippet, Icon } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { ACTIVITY_STATUSES } from "../../constants";
import { useActivities } from "../../hooks";
import classes from "./ActivityDetails.module.scss";
import ActivityDetailsButtons from "./components/ActivityDetailsButtons";

interface ActivityDetailsProps {
  readonly activityId: number;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activityId }) => {
  const { getSingleActivityQuery } = useActivities();

  const {
    data: getSingleActivityQueryResult,
    isPending: getSingleActivityQueryPending,
    error: getSingleActivityQueryError,
  } = getSingleActivityQuery({ activityId });

  const instanceId = getSingleActivityQueryResult?.data.computer_id;

  const isInstanceIdDefined = instanceId !== undefined;

  const { instance, isGettingInstance } = useGetInstance(
    { instanceId: instanceId as number },
    { enabled: isInstanceIdDefined },
  );

  if (getSingleActivityQueryPending) {
    return <LoadingState />;
  }

  if (getSingleActivityQueryError) {
    throw getSingleActivityQueryError;
  }

  if (!getSingleActivityQueryResult?.data) {
    throw new Error();
  }

  if (isInstanceIdDefined && isGettingInstance) {
    return <LoadingState />;
  }

  const activity = getSingleActivityQueryResult.data;

  return (
    <>
      <ActivityDetailsButtons activity={activity} />

      <InfoGrid spaced>
        <InfoGrid.Item label="Description" large value={activity.summary} />

        {instance && (
          <InfoGrid.Item
            label="Instance"
            large
            value={
              <StaticLink
                to={`/instances/${instance.parent ? `${instance.parent.id}/${instance.id}` : instance.id}`}
              >
                {instance.title}
              </StaticLink>
            }
          />
        )}

        <InfoGrid.Item
          label="Status"
          value={
            <>
              <Icon
                name={ACTIVITY_STATUSES[activity.activity_status].icon}
                className={classes.statusIcon}
              />
              <span>{ACTIVITY_STATUSES[activity.activity_status].label}</span>
            </>
          }
        />
        <InfoGrid.Item
          label="Created at"
          value={moment(activity.creation_time).format(
            DISPLAY_DATE_TIME_FORMAT,
          )}
        />

        {typeof activity.delivery_time === "string" && (
          <InfoGrid.Item
            label="Delivered at"
            value={moment(activity.delivery_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
        {activity.completion_time !== null && (
          <InfoGrid.Item
            label="Completed at"
            value={moment(activity.completion_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
      </InfoGrid>

      {activity.result_text && (
        <CodeSnippet
          className={classes.output}
          blocks={[
            {
              title: "Output",
              code: activity.result_text,
            },
          ]}
        />
      )}
    </>
  );
};

export default ActivityDetails;
