import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import ProfileAssociationInfo from "@/components/form/ProfileAssociationInfo";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useIsSecurityProfilesLimitReached } from "../../api";
import useGetPageSecurityProfile from "../../api/useGetPageSecurityProfile";
import {
  SECURITY_PROFILE_BENCHMARK_LABELS,
  SECURITY_PROFILE_MODE_LABELS,
} from "../../constants";
import { getSchedule, getStatus, getTailoringFile } from "../../helpers";
import SecurityProfileArchiveModal from "../SecurityProfileArchiveModal";

const SecurityProfileDetailsSidePanel: FC = () => {
  const { createSidePathPusher } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { securityProfile: profile, isGettingSecurityProfile } =
    useGetPageSecurityProfile();
  const profileLimitReached = useIsSecurityProfilesLimitReached();
  const { data: accessGroupsData, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  if (isGettingSecurityProfile || isGettingAccessGroups) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>{profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <Button
              className="p-segmented-control__button"
              type="button"
              hasIcon
              onClick={createSidePathPusher("download")}
            >
              <Icon name="file-blank" />
              <span>Download audit</span>
            </Button>

            {profile.status !== "archived" && (
              <Button
                className="p-segmented-control__button"
                type="button"
                hasIcon
                onClick={createSidePathPusher("edit")}
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
                onClick={createSidePathPusher("run")}
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
              onClick={createSidePathPusher("duplicate")}
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
                onClick={openArchiveModal}
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
              <InfoGrid.Item label="Title" value={profile.title} />
              <InfoGrid.Item label="Name" value={profile.name} />

              <InfoGrid.Item
                label="Access group"
                value={getTitleByName(profile.access_group, accessGroupsData)}
              />
              <InfoGrid.Item label="Status" value={getStatus(profile).label} />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Security profile">
            <InfoGrid>
              <InfoGrid.Item
                label="Benchmark"
                value={SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
              />

              <InfoGrid.Item
                label="Tailoring file"
                value={getTailoringFile(profile)}
              />

              <InfoGrid.Item
                label="Mode"
                large
                value={SECURITY_PROFILE_MODE_LABELS[profile.mode]}
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Schedule">
            <InfoGrid>
              <InfoGrid.Item
                label="Schedule"
                large
                value={getSchedule(profile)}
              />

              <InfoGrid.Item
                label="Last run"
                value={
                  profile.last_run_results.timestamp
                    ? `${moment(profile.last_run_results.timestamp).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                    : null
                }
              />

              <InfoGrid.Item
                label="Next run"
                value={
                  profile.next_run_time
                    ? `${moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
                    : null
                }
              />

              {profile.mode === "audit-fix-restart" && (
                <InfoGrid.Item
                  label="Restart schedule"
                  large
                  value={`${
                    profile.restart_deliver_delay
                      ? `Delayed by ${profile.restart_deliver_delay} ${pluralize(profile.restart_deliver_delay, "hour")}`
                      : "As soon as possible"
                  }${profile.restart_deliver_delay_window ? `, randomize delivery over ${profile.restart_deliver_delay_window} ${pluralize(profile.restart_deliver_delay_window, "minute")}` : ""}`}
                />
              )}
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Association">
            <ProfileAssociationInfo profile={profile}>
              <InfoGrid>
                <InfoGrid.Item
                  label="Associated instances"
                  large
                  value={
                    <ProfileAssociatedInstancesLink
                      count={profile.associated_instances}
                      profile={profile}
                      query={`security:${profile.id}`}
                    />
                  }
                />
                <InfoGrid.Item
                  label="Tags"
                  large
                  value={profile.tags.join(", ")}
                  type="truncated"
                />
              </InfoGrid>
            </ProfileAssociationInfo>
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <SecurityProfileArchiveModal
        close={closeArchiveModal}
        opened={archiveModalOpened}
        profile={profile}
      />
    </>
  );
};

export default SecurityProfileDetailsSidePanel;
