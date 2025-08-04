import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import moment from "moment";
import type { ComponentProps, FC } from "react";
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

  const scheduleMenuItems: ComponentProps<typeof Menu>["items"] = [
    { label: "Schedule", size: 12, value: getSchedule(profile) },
    {
      label: "Last run",
      size: 6,
      value: profile.last_run_results.timestamp ? (
        `${moment(profile.last_run_results.timestamp).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
      ) : (
        <NoData />
      ),
    },
    {
      label: "Next run",
      size: 6,
      value: profile.next_run_time ? (
        `${moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
      ) : (
        <NoData />
      ),
    },
  ];

  if (profile.mode == "audit-fix-restart") {
    scheduleMenuItems.push({
      label: "Restart schedule",
      size: 12,
      value: `${
        profile.restart_deliver_delay
          ? `Delayed by ${profile.restart_deliver_delay} ${pluralize(profile.restart_deliver_delay, "hour")}`
          : "As soon as possible"
      }${profile.restart_deliver_delay_window ? `, Randomize delivery over ${profile.restart_deliver_delay_window} ${pluralize(profile.restart_deliver_delay_window, "minute")}` : ""}`,
    });
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

      <Blocks
        items={[
          {
            content: (
              <Menu
                items={[
                  {
                    label: "Title",
                    size: 6,
                    value: profile.title,
                  },
                  {
                    label: "Name",
                    size: 6,
                    value: profile.name,
                  },
                  {
                    label: "Access group",
                    size: 6,
                    value: accessGroup.title,
                  },
                  {
                    label: "Status",
                    size: 6,
                    value: getStatus(profile).label,
                  },
                ]}
              />
            ),
          },
          {
            title: "Security profile",
            content: (
              <Menu
                items={[
                  {
                    label: "Benchmark",
                    size: 6,
                    value: SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark],
                  },
                  {
                    label: "Tailoring file",
                    size: 6,
                    value: getTailoringFile(profile),
                  },
                  {
                    label: "Mode",
                    size: 12,
                    value: SECURITY_PROFILE_MODE_LABELS[profile.mode],
                  },
                ]}
              />
            ),
          },
          {
            title: "Schedule",
            content: <Menu items={scheduleMenuItems} />,
          },
          {
            title: "Association",
            content: (
              <Menu
                items={[
                  {
                    label: "Associated instances",
                    size: 12,
                    value: (
                      <SecurityProfileAssociatedInstancesLink
                        securityProfile={profile}
                      />
                    ),
                  },
                  {
                    label: "Tags",
                    size: 12,
                    value: getTags(profile),
                    type: "truncated",
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default SecurityProfileDetails;
