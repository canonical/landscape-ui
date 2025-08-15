import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import {
  useGetSecurityProfiles,
  useIsSecurityProfilesLimitReached,
} from "../../api";
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
import SecurityProfileArchiveModal from "../SecurityProfileArchiveModal";
import SecurityProfileAssociatedInstancesLink from "../SecurityProfileAssociatedInstancesLink";

const SecurityProfileDetails: FC = () => {
  const { securityProfile: securityProfileId, setPageParams } = usePageParams();

  const profileLimitReached = useIsSecurityProfilesLimitReached();
  const { isSecurityProfilesLoading, securityProfiles, securityProfilesError } =
    useGetSecurityProfiles();
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
    error: accessGroupsError,
  } = getAccessGroupQuery();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  if (securityProfilesError) {
    throw securityProfilesError;
  }

  if (accessGroupsError) {
    throw accessGroupsError;
  }

  if (isSecurityProfilesLoading || isAccessGroupsLoading) {
    return <LoadingState />;
  }

  const profile = securityProfiles.find(({ id }) => id === securityProfileId);

  if (!profile) {
    throw new Error("The security profile could not be found.");
  }

  const accessGroup = getAccessGroupQueryResponse?.data.find(
    (group) => group.name == profile.access_group,
  );

  if (!accessGroup) {
    throw new Error("The access group could not be found.");
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
              onClick={() => {
                setPageParams({ action: "view/download" });
              }}
            >
              <Icon name="file-blank" />
              <span>Download audit</span>
            </Button>

            {profile.status !== "archived" && (
              <Button
                className="p-segmented-control__button"
                type="button"
                hasIcon
                onClick={() => {
                  setPageParams({ action: "view/edit" });
                }}
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
                onClick={() => {
                  setPageParams({ action: "view/run" });
                }}
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
              onClick={() => {
                setPageParams({ action: "view/duplicate" });
              }}
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

              <InfoGrid.Item label="Access group" value={accessGroup.title} />
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
            <InfoGrid>
              <InfoGrid.Item
                label="Associated instances"
                large
                value={
                  <SecurityProfileAssociatedInstancesLink
                    securityProfile={profile}
                  />
                }
              />

              <InfoGrid.Item
                label="Tags"
                large
                value={getTags(profile)}
                type="truncated"
              />
            </InfoGrid>
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

export default SecurityProfileDetails;
