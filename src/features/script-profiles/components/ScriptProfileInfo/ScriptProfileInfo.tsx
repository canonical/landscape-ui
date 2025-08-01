import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import moment from "moment";
import type { ComponentProps, FC } from "react";
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

  const triggerMenuItems: ComponentProps<typeof Menu>["items"] = [
    {
      label: "Trigger",
      size: 12,
      value: getTriggerLongText(profile) || <NoData />,
    },
  ];

  if (profile.trigger.trigger_type !== "event") {
    triggerMenuItems.push({
      label: "Next run",
      size: 6,
      value: profile.trigger.next_run ? (
        `${moment(profile.trigger.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT)}`
      ) : (
        <NoData />
      ),
    });
  }

  triggerMenuItems.push({
    label: "Last run",
    size: 6,
    value: activity ? (
      <Link to={`/activities?query=parent-id%3A${activity.id}`}>
        {moment(activity.creation_time).utc().format(DISPLAY_DATE_TIME_FORMAT)}
      </Link>
    ) : (
      <NoData />
    ),
  });

  return (
    <Blocks>
      {{
        key: 0,
        content: (
          <Menu
            items={[
              {
                label: "Title",
                size: 6,
                value: profile.title,
              },
              {
                label: "Status",
                size: 6,
                value: getStatusText(profile),
              },
              {
                label: "Script",
                size: 6,
                value: script ? (
                  <Link
                    to="/scripts?tab=scripts"
                    state={{ scriptId: script.id }}
                  >
                    {script.title}
                  </Link>
                ) : (
                  <NoData />
                ),
              },
              {
                label: "Access group",
                size: 6,
                value: accessGroup,
              },
              {
                label: "Run as user",
                size: 6,
                value: profile.username,
              },
              {
                label: "Time limit",
                size: 6,
                value: `${profile.time_limit}s`,
              },
            ]}
          />
        ),
      }}
      {{ key: 1, content: <Menu items={triggerMenuItems} /> }}
      {{
        key: "association",
        title: "Association",
        content: (
          <Menu
            items={[
              {
                label: "Associated instances",
                size: 12,
                value: (
                  <ScriptProfileAssociatedInstancesLink
                    scriptProfile={profile}
                  />
                ),
              },
              {
                label: "Tags",
                size: 12,
                value: profile.all_computers
                  ? "All instances"
                  : profile.tags.join(", ") || <NoData />,
                type: "truncated",
              },
            ]}
          />
        ),
      }}
    </Blocks>
  );
};

export default ScriptProfileInfo;
