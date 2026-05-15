import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { Profile } from "../../../../types";
import {
  hasLastRunData,
  isPostEnrollmentScriptProfile,
  isProfileArchived,
  isRebootProfile,
  isScriptProfile,
  isUsgProfile,
  isUpgradeProfile,
} from "../../../../helpers";
import Blocks from "@/components/layout/Blocks";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import { getLastRunData, getNextRunData, getScheduleMessage } from "./helpers";
import { pluralize } from "@/utils/_helpers";

interface ViewProfileScheduleBlockProps {
  readonly profile: Profile;
}

const ViewProfileScheduleBlock: FC<ViewProfileScheduleBlockProps> = ({
  profile,
}) => {
  const scheduleLabel = isScriptProfile(profile) ? "Trigger" : "Schedule";
  const lastRun = getLastRunData(profile);
  const hasNextRun =
    !isProfileArchived(profile) && !isPostEnrollmentScriptProfile(profile);
  const nextRun = getNextRunData(profile);
  const nextLabel = isRebootProfile(profile) ? "Next restart" : "Next run";

  return (
    <Blocks.Item title="Running schedule">
      <InfoGrid dense>
        <InfoGrid.Item
          label={scheduleLabel}
          large
          value={getScheduleMessage(profile)}
        />

        {hasLastRunData(profile) && (
          <InfoGrid.Item
            label="Last run"
            value={
              lastRun
                ? `${moment(lastRun).utc().format(DISPLAY_DATE_TIME_FORMAT)} UTC`
                : null
            }
          />
        )}

        {isUpgradeProfile(profile) && (
          <InfoGrid.Item
            label="Delivery delay window"
            value={`${pluralize(Number(profile.deliver_delay_window), "minute", { showCount: "exact" })}`}
          />
        )}

        {hasNextRun && (
          <InfoGrid.Item
            label={nextLabel}
            value={
              nextRun
                ? `${moment(nextRun).utc().format(DISPLAY_DATE_TIME_FORMAT)} UTC`
                : null
            }
          />
        )}

        {isUsgProfile(profile) && profile.mode == "audit-fix-restart" && (
          <InfoGrid.Item
            label="Restart schedule"
            large
            value={`${
              profile.restart_deliver_delay
                ? `Delayed by ${pluralize(profile.restart_deliver_delay, "hour", { showCount: "exact" })}`
                : "As soon as possible"
            }${
              profile.restart_deliver_delay_window
                ? `, randomize delivery over ${pluralize(profile.restart_deliver_delay_window, "minute", { showCount: "exact" })}`
                : ""
            }`}
          />
        )}
      </InfoGrid>
    </Blocks.Item>
  );
};

export default ViewProfileScheduleBlock;
