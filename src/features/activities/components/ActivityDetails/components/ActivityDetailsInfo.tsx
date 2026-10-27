import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { Icon } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { ACTIVITY_STATUSES } from "../../../constants";
import type { Activity } from "../../../types";
import classes from "../ActivityDetails.module.scss";

interface ActivityDetailsInfoProps {
  readonly activity: Activity;
  readonly instanceLink?: ReactNode;
}

const ActivityDetailsInfo: FC<ActivityDetailsInfoProps> = ({
  activity,
  instanceLink,
}) => (
  <InfoGrid dense>
    {instanceLink && (
      <InfoGrid.Item label="Instance" large value={instanceLink} />
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
      value={date(activity.creation_time).format(DISPLAY_DATE_TIME_FORMAT)}
    />
    {typeof activity.delivery_time === "string" && (
      <InfoGrid.Item
        label="Delivered at"
        value={date(activity.delivery_time).format(DISPLAY_DATE_TIME_FORMAT)}
      />
    )}
    {activity.completion_time !== null && (
      <InfoGrid.Item
        label="Completed at"
        value={date(activity.completion_time).format(DISPLAY_DATE_TIME_FORMAT)}
      />
    )}
    <InfoGrid.Item label="Creator" large value={activity.creator?.name} />
  </InfoGrid>
);

export default ActivityDetailsInfo;
