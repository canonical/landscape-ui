import { FC } from "react";
import { Button, Col, Row } from "@canonical/react-components";
import { Activity } from "../../types/Activity";
import useDebug from "../../hooks/useDebug";
import useConfirm from "../../hooks/useConfirm";
import useSidePanel from "../../hooks/useSidePanel";
import useActivities from "../../hooks/useActivities";
import useComputers from "../../hooks/useComputers";
import InfoItem from "../layout/InfoItem";
import { ACTIVITY_STATUSES } from "./_data";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "../../constants";

interface ActivityDetailsProps {
  activity: Activity;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({ activity }) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { closeSidePanel } = useSidePanel();

  const { approveActivitiesQuery, cancelActivitiesQuery } = useActivities();
  const { getComputersQuery } = useComputers();

  const {
    mutateAsync: approveActivities,
    isLoading: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isLoading: cancelActivitiesLoading } =
    cancelActivitiesQuery;

  const handleApproveActivities = async () => {
    confirmModal({
      title: "Approve activity",
      body: `Are you sure you want to approve ${activity.summary} activity?`,
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={async () => {
            try {
              await approveActivities({ query: `id:${activity.id}` });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Approve
        </Button>,
      ],
    });
  };

  const handleCancelActivities = async () => {
    confirmModal({
      title: "Cancel activity",
      body: `Are you sure you want to cancel ${activity.summary} activity?`,
      buttons: [
        <Button
          key="cancel"
          appearance="positive"
          onClick={async () => {
            try {
              await cancelActivities({ query: `id:${activity.id}` });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Apply
        </Button>,
      ],
    });
  };

  const { data: getComputersQueryResult, error: getComputersQueryError } =
    getComputersQuery(
      {
        query: `id:${activity.computer_id}`,
      },
      {
        enabled: !!activity.computer_id,
      },
    );

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const computerTitle = getComputersQueryResult?.data.results[0].title ?? "";

  return (
    <>
      <div key="buttons" className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={handleApproveActivities}
            disabled={approveActivitiesLoading}
          >
            <span>Approve</span>
          </Button>
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={handleCancelActivities}
            disabled={cancelActivitiesLoading}
          >
            <span>Cancel</span>
          </Button>
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={() => {}}
          >
            <span>Undo</span>
          </Button>
          <Button
            className="p-segmented-control__button"
            type="button"
            onClick={() => {}}
          >
            <span>Redo</span>
          </Button>
        </div>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={12}>
          <InfoItem label="Description" value={activity.summary} />
        </Col>
        {computerTitle && (
          <Col size={12}>
            <InfoItem label="Computer" value={computerTitle} />
          </Col>
        )}
        <Col size={6}>
          <InfoItem
            label="Status"
            value={ACTIVITY_STATUSES[activity.activity_status].label}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Created at"
            value={moment(activity.creation_time).format(
              DISPLAY_DATE_TIME_FORMAT,
            )}
          />
        </Col>
        {typeof activity.delivery_time === "string" && (
          <Col size={6}>
            <InfoItem
              label="Delivered at"
              value={moment(activity.delivery_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            />
          </Col>
        )}
        {activity.completion_time && (
          <Col size={6}>
            <InfoItem
              label="Completed at"
              value={moment(activity.completion_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            />
          </Col>
        )}
        {activity.result_text && (
          <Col size={12}>
            <InfoItem label="Output" value={activity.result_text} />
          </Col>
        )}
      </Row>

      <div className="form-buttons">
        <Button
          type="button"
          onClick={closeSidePanel}
          className="u-no-margin--bottom"
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default ActivityDetails;
