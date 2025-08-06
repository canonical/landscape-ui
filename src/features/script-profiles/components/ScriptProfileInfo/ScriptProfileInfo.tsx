import Blocks from "@/components/layout/Blocks";
import Grid from "@/components/layout/Grid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
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
        <Grid>
          <Grid.Item label="Title" size={6} value={profile.title} />

          <Grid.Item label="Status" size={6} value={getStatusText(profile)} />

          <Grid.Item
            label="Script"
            size={6}
            value={
              script ? (
                <Link to="/scripts?tab=scripts" state={{ scriptId: script.id }}>
                  {script.title}
                </Link>
              ) : null
            }
          />

          <Grid.Item label="Access group" size={6} value={accessGroup} />

          <Grid.Item label="Run as user" size={6} value={profile.username} />

          <Grid.Item
            label="Time limit"
            size={6}
            value={`${profile.time_limit}s`}
          />
        </Grid>
      </Blocks.Item>

      <Blocks.Item>
        <Grid>
          <Grid.Item
            label="Trigger"
            size={12}
            value={getTriggerLongText(profile) || null}
          />

          {profile.trigger.trigger_type !== "event" && (
            <Grid.Item
              label="Next run"
              size={6}
              value={
                profile.trigger.next_run
                  ? `${moment(profile.trigger.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT)}`
                  : null
              }
            />
          )}

          <Grid.Item
            label="Last run"
            size={6}
            value={
              activity ? (
                <Link to={`/activities?query=parent-id%3A${activity.id}`}>
                  {moment(activity.creation_time)
                    .utc()
                    .format(DISPLAY_DATE_TIME_FORMAT)}
                </Link>
              ) : null
            }
          />
        </Grid>
      </Blocks.Item>

      <Blocks.Item title="Association">
        <Grid>
          <Grid.Item
            label="Associated instances"
            size={12}
            value={
              <ScriptProfileAssociatedInstancesLink scriptProfile={profile} />
            }
          />

          <Grid.Item
            label="Tags"
            size={12}
            value={
              profile.all_computers
                ? "All instances"
                : profile.tags.join(", ") || null
            }
            type="truncated"
          />
        </Grid>
      </Blocks.Item>
    </Blocks>
  );
};

export default ScriptProfileInfo;
