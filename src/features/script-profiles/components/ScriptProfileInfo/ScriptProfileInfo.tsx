import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import { Col, Row } from "@canonical/react-components";
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
    <>
      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Title" value={profile.title} />
        </Col>

        <Col size={6}>
          <InfoItem label="Status" value={getStatusText(profile)} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem
            label="Script"
            value={
              script ? (
                <Link to="/scripts?tab=scripts" state={{ scriptId: script.id }}>
                  {script.title}
                </Link>
              ) : (
                <NoData />
              )
            }
          />
        </Col>

        <Col size={6}>
          <InfoItem label="Access group" value={accessGroup} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Run as user" value={profile.username} />
        </Col>

        <Col size={6}>
          <InfoItem label="Time limit" value={`${profile.time_limit}s`} />
        </Col>
      </Row>

      <hr />

      <InfoItem
        label="Trigger"
        value={getTriggerLongText(profile) || <NoData />}
      />

      <Row className="u-no-padding">
        {profile.trigger.trigger_type != "event" && (
          <Col size={6}>
            <InfoItem
              label="Next run"
              value={
                profile.trigger.next_run ? (
                  `${moment(profile.trigger.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT)}`
                ) : (
                  <NoData />
                )
              }
            />
          </Col>
        )}

        <Col size={6}>
          <InfoItem
            label="Last run"
            value={
              activity ? (
                <Link to={`/activities?query=parent-id%3A${activity.id}`}>
                  {moment(activity.creation_time)
                    .utc()
                    .format(DISPLAY_DATE_TIME_FORMAT)}
                </Link>
              ) : (
                <NoData />
              )
            }
          />
        </Col>
      </Row>

      <hr />
      <p className="p-heading--5">Association</p>

      <Row className="u-no-padding">
        <InfoItem
          label="Associated instances"
          value={
            <ScriptProfileAssociatedInstancesLink scriptProfile={profile} />
          }
        />
      </Row>

      <Row className="u-no-padding">
        <InfoItem
          label="Tags"
          value={
            profile.all_computers
              ? "All instances"
              : profile.tags.join(", ") || <NoData />
          }
        />
      </Row>
    </>
  );
};

export default ScriptProfileInfo;
