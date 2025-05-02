import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useRoles from "@/hooks/useRoles";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import moment from "moment";
import { type FC } from "react";
import {
  SECURITY_PROFILE_BENCHMARK_LABELS,
  SECURITY_PROFILE_MODE_LABELS,
} from "../../constants";
import {
  getAssociatedInstancesLink,
  getSchedule,
  getStatus,
  getTags,
  getTailoringFile,
} from "../../helpers";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";

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

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Name" value={profile.title} />
        </Col>

        <Col size={6}>
          <InfoItem label="Access group" value={accessGroup.title} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <InfoItem label="Status" value={getStatus(profile).label} />
      </Row>

      <hr />
      <h5>Security profile</h5>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem
            label="Benchmark"
            value={SECURITY_PROFILE_BENCHMARK_LABELS[profile.benchmark]}
          />
        </Col>

        <Col size={6}>
          <InfoItem label="Tailoring file" value={getTailoringFile(profile)} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <InfoItem
          label="Mode"
          value={SECURITY_PROFILE_MODE_LABELS[profile.mode]}
        />
      </Row>

      <hr />
      <h5>Schedule</h5>

      <Row className="u-no-padding">
        <InfoItem label="Profile schedule" value={getSchedule(profile)} />
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem
            label="Last run"
            value={
              profile.last_run_results.timestamp ? (
                `${moment(profile.last_run_results.timestamp).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
              ) : (
                <NoData />
              )
            }
          />
        </Col>

        <Col size={6}>
          <InfoItem
            label="Next run"
            value={
              profile.next_run_time ? (
                `${moment(profile.next_run_time).format(DISPLAY_DATE_TIME_FORMAT)} GMT`
              ) : (
                <NoData />
              )
            }
          />
        </Col>
      </Row>

      {profile.mode == "audit-fix-restart" && (
        <Row className="u-no-padding">
          <InfoItem
            label="Restart schedule"
            value={`${
              profile.restart_deliver_delay
                ? `Delayed by ${profile.restart_deliver_delay} hour${profile.restart_deliver_delay == 1 ? "" : "s"}`
                : "As soon as possible"
            }${profile.restart_deliver_delay_window ? `, Randomize delivery over ${profile.restart_deliver_delay_window} minute${profile.restart_deliver_delay_window == 1 ? "" : "s"}` : ""}`}
          />
        </Row>
      )}

      <hr />
      <h5>Association</h5>

      <Row className="u-no-padding">
        <InfoItem
          label="Associated instances"
          value={getAssociatedInstancesLink(profile)}
        />
      </Row>

      <Row className="u-no-padding">
        <InfoItem label="Tags" value={getTags(profile)} />
      </Row>
    </>
  );
};

export default SecurityProfileDetails;
