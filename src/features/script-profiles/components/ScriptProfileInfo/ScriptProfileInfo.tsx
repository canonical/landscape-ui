import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Activity } from "@/features/activities";
import { useGetSingleScript } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Col, Row } from "@canonical/react-components";
import moment from "moment";
import { lazy, Suspense, type FC } from "react";
import { Link } from "react-router";
import { getStatusText, getTriggerLongText } from "../../helpers";
import type { ScriptProfile } from "../../types";

const ScriptDetails = lazy(
  async () => import("@/features/scripts/components/ScriptDetails"),
);

interface ScriptProfileInfoProps {
  readonly goBack: () => void;
  readonly profile: ScriptProfile;
  readonly viewActivityDetails: (activity: Activity) => void;
}

const ScriptProfileInfo: FC<ScriptProfileInfoProps> = ({
  goBack,
  profile,
  viewActivityDetails,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const { script, isScriptLoading } = useGetSingleScript(profile.script_id);
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
  } = getAccessGroupQuery();

  if (isScriptLoading || isAccessGroupsLoading) {
    return <LoadingState />;
  }

  const accessGroup = getAccessGroupQueryResponse?.data.find(
    (group) => group.name == profile.access_group,
  );

  if (!script || !accessGroup) {
    throw new Error();
  }

  const viewScriptDetails = () => {
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <>
          <ScriptDetails scriptId={script.id} />
          <SidePanelFormButtons
            hasActionButtons={false}
            hasBackButton={true}
            onBackButtonPress={goBack}
          />
        </>
      </Suspense>,
    );
  };

  const activity = profile.activities.last_activity;

  return (
    <>
      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Name" value={profile.title} />
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
              <Button
                type="button"
                appearance="link"
                className="u-no-margin u-no-padding--top"
                onClick={viewScriptDetails}
              >
                {script.title}
              </Button>
            }
          />
        </Col>

        <Col size={6}>
          <InfoItem label="Access group" value={accessGroup.title} />
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

      <InfoItem label="Trigger" value={getTriggerLongText(profile)} />

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Next run" value="PLACEHOLDER" />
        </Col>

        <Col size={6}>
          <InfoItem
            label="Last run"
            value={
              activity ? (
                <Button
                  type="button"
                  appearance="link"
                  className="u-no-margin u-no-padding--top"
                  onClick={() => {
                    viewActivityDetails(activity);
                  }}
                >
                  {moment(activity.creation_time)
                    .utc()
                    .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
                  GMT
                </Button>
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
            profile.computers.num_associated_computers ? (
              <Link
                to={{
                  pathname: "/instances",
                  search: `?tags=${profile.tags.join("%2C")}`,
                }}
              >
                {profile.computers.num_associated_computers} instances
              </Link>
            ) : (
              "0 instances"
            )
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
