import Blocks from "@/components/layout/Blocks";
import Grid from "@/components/layout/Grid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import {
  SECURITY_PROFILE_BENCHMARK_LABELS,
  SECURITY_PROFILE_MODE_LABELS,
} from "../../constants";
import {
  getSchedule,
  getStatus,
  getTags,
  getTailoringFile,
} from "../../helpers";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";
import SecurityProfileAssociatedInstancesLink from "../SecurityProfileAssociatedInstancesLink";

interface SecurityProfileDetailsProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
  readonly profileLimitReached?: boolean;
}

const SecurityProfileDetails: FC<SecurityProfileDetailsProps> = ({
  actions,
  profile,
  profileLimitReached,
}) => {
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
  } = getAccessGroupQuery();

  if (isAccessGroupsLoading) {
    return <LoadingState />;
  }

  const accessGroup = getAccessGroupQueryResponse?.data.find(
    (group) => group.name == profile.access_group,
  );

  if (!accessGroup) {
    return;
  }

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            type="button"
            hasIcon
            onClick={actions.downloadAudit}
          >
            <Icon name="file-blank" />
            <span>Download audit</span>
          </Button>

          {profile.status !== "archived" && (
            <Button
              className="p-segmented-control__button"
              type="button"
              hasIcon
              onClick={actions.edit}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>
          )}

          {profile.status !== "archived" && (
            <Button
              className="p-segmented-control__button"
              type="button"
              hasIcon
              onClick={actions.run}
              disabled={!profile.associated_instances}
            >
              <Icon name="play" />
              <span>Run</span>
            </Button>
          )}

          <Button
            className="p-segmented-control__button"
            type="button"
            hasIcon
            onClick={actions.duplicate}
            disabled={profileLimitReached}
          >
            <Icon name="canvas" />
            <span>Duplicate</span>
          </Button>

          {profile.status !== "archived" && (
            <Button
              className="p-segmented-control__button"
              type="button"
              hasIcon
              onClick={actions.archive}
            >
              <Icon name="archive" />
              <span>Archive</span>
            </Button>
          )}
        </div>
      </div>

      <Blocks>
        <Blocks.Item>
          <Grid>
            <Grid.Item label="Title" size={6} value={profile.title} />
            <Grid.Item label="Name" size={6} value={profile.name} />

            <Grid.Item
              label="Access group"
              size={6}
              value={accessGroup.title}
            />
            <Grid.Item
              label="Status"
              size={6}
              value={getStatus(profile).label}
            />
          </Grid>
        </Blocks.Item>

        <Blocks.Item title="Security profile">
          <Grid>
            <Grid.Item
              label="Benchmark"
              size={6}
              value={SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
            />

            <Grid.Item
              label="Tailoring file"
              size={6}
              value={getTailoringFile(profile)}
            />

            <Grid.Item
              label="Mode"
              size={12}
              value={SECURITY_PROFILE_MODE_LABELS[profile.mode]}
            />
          </Grid>
        </Blocks.Item>

        <Blocks.Item title="Schedule">
          <Grid>
            <Grid.Item
              label="Schedule"
              size={12}
              value={getSchedule(profile)}
            />

            <Grid.Item
              label="Last run"
              size={6}
              value={
                profile.last_run_results.timestamp
                  ? `${moment(profile.last_run_results.timestamp).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                  : null
              }
            />

            <Grid.Item
              label="Next run"
              size={6}
              value={
                profile.next_run_time
                  ? `${moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                  : null
              }
            />

            {profile.mode === "audit-fix-restart" && (
              <Grid.Item
                label="Restart schedule"
                size={12}
                value={`${
                  profile.restart_deliver_delay
                    ? `Delayed by ${profile.restart_deliver_delay} ${pluralize(profile.restart_deliver_delay, "hour")}`
                    : "As soon as possible"
                }${profile.restart_deliver_delay_window ? `, Randomize delivery over ${profile.restart_deliver_delay_window} ${pluralize(profile.restart_deliver_delay_window, "minute")}` : ""}`}
              />
            )}
          </Grid>
        </Blocks.Item>

        <Blocks.Item title="Association">
          <Grid>
            <Grid.Item
              label="Associated instances"
              size={12}
              value={
                <SecurityProfileAssociatedInstancesLink
                  securityProfile={profile}
                />
              }
            />

            <Grid.Item
              label="Tags"
              size={12}
              value={getTags(profile)}
              type="truncated"
            />
          </Grid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default SecurityProfileDetails;
