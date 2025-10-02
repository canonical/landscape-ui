import ProfileAssociation from "@/components/form/ProfileAssociation";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import { ROUTES } from "@/libs/routes";
import moment from "moment";
import type { FC } from "react";
import { Link } from "react-router";
import { getStatusText, getTriggerLongText } from "../../helpers";
import type { ScriptProfile } from "../../types";
import ScriptProfileAssociatedInstancesLink from "../ScriptProfileAssociatedInstancesLink";

interface ScriptProfileInfoProps {
  readonly profile: ScriptProfile;
}

const ScriptProfileInfo: FC<ScriptProfileInfoProps> = ({ profile }) => {
  const { script, isScriptLoading } = useGetSingleScript(profile.script_id);
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
  } = getAccessGroupQuery();

  if (isScriptLoading || isAccessGroupsLoading) {
    return <LoadingState />;
  }

  const accessGroup =
    getAccessGroupQueryResponse?.data.find(
      (group) => group.name == profile.access_group,
    )?.title || profile.access_group;

  const activity = profile.activities.last_activity;

  return (
    <Blocks>
      <Blocks.Item>
        <InfoGrid>
          <InfoGrid.Item label="Title" value={profile.title} />

          <InfoGrid.Item label="Status" value={getStatusText(profile)} />

          <InfoGrid.Item
            label="Script"
            value={
              script ? (
                <Link
                  to={ROUTES.scripts.root({ tab: "scripts" })}
                  state={{ scriptId: script.id }}
                >
                  {script.title}
                </Link>
              ) : null
            }
          />

          <InfoGrid.Item label="Access group" value={accessGroup} />

          <InfoGrid.Item label="Run as user" value={profile.username} />

          <InfoGrid.Item label="Time limit" value={`${profile.time_limit}s`} />
        </InfoGrid>
      </Blocks.Item>

      <Blocks.Item>
        <InfoGrid>
          <InfoGrid.Item
            label="Trigger"
            large
            value={getTriggerLongText(profile)}
          />

          {profile.trigger.trigger_type !== "event" && (
            <InfoGrid.Item
              label="Next run"
              value={
                profile.trigger.next_run
                  ? `${moment(profile.trigger.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT)}`
                  : null
              }
            />
          )}

          <InfoGrid.Item
            label="Last run"
            value={
              activity ? (
                <Link
                  to={ROUTES.activities.root({
                    query: `parent-id:${activity.id}`,
                  })}
                >
                  {moment(activity.creation_time)
                    .utc()
                    .format(DISPLAY_DATE_TIME_FORMAT)}
                </Link>
              ) : null
            }
          />
        </InfoGrid>
      </Blocks.Item>

      <Blocks.Item title="Association">
        <ProfileAssociation profile={profile}>
          <InfoGrid>
            <InfoGrid.Item
              label="Associated instances"
              large
              value={
                <ScriptProfileAssociatedInstancesLink scriptProfile={profile} />
              }
            />
            <InfoGrid.Item
              label="Tags"
              large
              value={profile.tags.join(", ")}
              type="truncated"
            />
          </InfoGrid>
        </ProfileAssociation>
      </Blocks.Item>
    </Blocks>
  );
};

export default ScriptProfileInfo;
