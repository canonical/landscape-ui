import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstance } from "@/features/instances";
import { CodeSnippet, Icon } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { ACTIVITY_STATUSES } from "../../constants";
import { useGetSingleActivity } from "../../api";
import classes from "./ActivityDetails.module.scss";
import ActivityDetailsButtons from "./components/ActivityDetailsButtons";
import { ROUTES } from "@/libs/routes/routes";

interface ActivityDetailsProps {
  readonly activityId: number;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activityId }) => {
  const { activity, isGettingActivity, activityError } = useGetSingleActivity({
    activityId,
  });

  const instanceId = activity?.computer_id;

  const isInstanceIdDefined = instanceId !== undefined;

  const { instance, isGettingInstance } = useGetInstance(
    { instanceId: instanceId as number },
    { enabled: isInstanceIdDefined },
  );

  if (isGettingActivity) {
    return <LoadingState />;
  }

  if (activityError) {
    throw activityError;
  }

  if (!activity) {
    throw new Error();
  }

  if (isInstanceIdDefined && isGettingInstance) {
    return <LoadingState />;
  }

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
              <StaticLink to={ROUTES.instances.details.fromInstance(instance)}>
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
              wrapLines: true,
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
