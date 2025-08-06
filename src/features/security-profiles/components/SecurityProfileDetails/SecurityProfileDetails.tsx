import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
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
          <InfoGrid>
            <InfoGrid.Item label="Title" size={6} value={profile.title} />
            <InfoGrid.Item label="Name" size={6} value={profile.name} />

            <InfoGrid.Item
              label="Access group"
              size={6}
              value={accessGroup.title}
            />
            <InfoGrid.Item
              label="Status"
              size={6}
              value={getStatus(profile).label}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Security profile">
          <InfoGrid>
            <InfoGrid.Item
              label="Benchmark"
              size={6}
              value={SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
            />

            <InfoGrid.Item
              label="Tailoring file"
              size={6}
              value={getTailoringFile(profile)}
            />

            <InfoGrid.Item
              label="Mode"
              size={12}
              value={SECURITY_PROFILE_MODE_LABELS[profile.mode]}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Schedule">
          <InfoGrid>
            <InfoGrid.Item
              label="Schedule"
              size={12}
              value={getSchedule(profile)}
            />

            <InfoGrid.Item
              label="Last run"
              size={6}
              value={
                profile.last_run_results.timestamp
                  ? `${moment(profile.last_run_results.timestamp).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                  : null
              }
            />

            <InfoGrid.Item
              label="Next run"
              size={6}
              value={
                profile.next_run_time
                  ? `${moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                  : null
              }
            />

            {profile.mode === "audit-fix-restart" && (
              <InfoGrid.Item
                label="Restart schedule"
                size={12}
                value={`${
                  profile.restart_deliver_delay
                    ? `Delayed by ${profile.restart_deliver_delay} ${pluralize(profile.restart_deliver_delay, "hour")}`
                    : "As soon as possible"
                }${profile.restart_deliver_delay_window ? `, Randomize delivery over ${profile.restart_deliver_delay_window} ${pluralize(profile.restart_deliver_delay_window, "minute")}` : ""}`}
              />
            )}
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Association">
          <InfoGrid>
            <InfoGrid.Item
              label="Associated instances"
              size={12}
              value={
                <SecurityProfileAssociatedInstancesLink
                  securityProfile={profile}
                />
              }
            />

            <InfoGrid.Item
              label="Tags"
              size={12}
              value={getTags(profile)}
              type="truncated"
            />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>
    </>
  );
};

export default SecurityProfileDetails;
