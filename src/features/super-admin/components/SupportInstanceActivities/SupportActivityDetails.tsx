import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ACTIVITY_STATUSES } from "@/features/activities";
import date from "@/libs/date";
import { CodeSnippet, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { useGetStaffActivity } from "../../api";
import classes from "./SupportActivityDetails.module.scss";

interface SupportActivityDetailsProps {
  /** The account the activity belongs to. */
  readonly name: string;
  readonly activityId: number;
}

/** An activity's details, read-only. */
const SupportActivityDetails: FC<SupportActivityDetailsProps> = ({
  name,
  activityId,
}) => {
  const { staffActivity, staffActivityError, isGettingStaffActivity } =
    useGetStaffActivity(name, activityId);

  if (isGettingStaffActivity) {
    return <LoadingState />;
  }

  if (staffActivityError) {
    throw staffActivityError;
  }

  if (!staffActivity) {
    throw new Error("The activity could not be loaded.");
  }

  const status = ACTIVITY_STATUSES[staffActivity.activity_status];

  return (
    <>
      <InfoGrid spaced>
        <InfoGrid.Item
          label="Description"
          large
          value={staffActivity.summary}
        />
        <InfoGrid.Item
          label="Status"
          value={
            <>
              <Icon name={status.icon} className={classes.statusIcon} />
              <span>{status.label}</span>
            </>
          }
        />
        <InfoGrid.Item
          label="Created at"
          value={date(staffActivity.creation_time).format(
            DISPLAY_DATE_TIME_FORMAT,
          )}
        />
        {typeof staffActivity.delivery_time === "string" && (
          <InfoGrid.Item
            label="Delivered at"
            value={date(staffActivity.delivery_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
        {staffActivity.completion_time !== null && (
          <InfoGrid.Item
            label="Completed at"
            value={date(staffActivity.completion_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        )}
        <InfoGrid.Item
          label="Creator"
          large
          value={staffActivity.creator?.name}
        />
      </InfoGrid>

      {staffActivity.result_text && (
        <CodeSnippet
          className={classes.output}
          blocks={[
            {
              wrapLines: true,
              title: "Output",
              code: staffActivity.result_text,
            },
          ]}
        />
      )}
    </>
  );
};

export default SupportActivityDetails;
