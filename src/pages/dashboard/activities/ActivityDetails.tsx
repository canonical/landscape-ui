import { FC, useEffect } from "react";
import { Activity } from "../../../types/Activity";
import { Button, Col, Row, Textarea } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import useConfirm from "../../../hooks/useConfirm";
import useActivities from "../../../hooks/useActivities";
import InfoItem from "../../../components/layout/InfoItem";
import useComputers from "../../../hooks/useComputers";
import useSidePanel from "../../../hooks/useSidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  output: Yup.string(),
});

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
          appearance="negative"
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
          Cancel
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

  const computer = getComputersQueryResult?.data[0] ?? null;

  const formik = useFormik({
    initialValues: {
      output: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values); // todo: replace with actual submit
      } catch (error) {
        debug(error);
      } finally {
        closeSidePanel();
      }
    },
  });

  useEffect(() => {
    if (!activity) {
      return;
    }

    formik.setFieldValue("output", activity.result_text ?? "");
  }, [activity]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div key="buttons" className="p-segmented-control">
        <div className="p-segmented-control__list">
          <button
            className="p-segmented-control__button"
            type="button"
            onClick={handleApproveActivities}
            disabled={approveActivitiesLoading}
          >
            <span>Approve</span>
          </button>
          <button
            className="p-segmented-control__button"
            type="button"
            onClick={handleCancelActivities}
            disabled={cancelActivitiesLoading}
          >
            <span>Cancel</span>
          </button>
          <button
            className="p-segmented-control__button"
            type="button"
            onClick={() => {}}
          >
            <span>Undo</span>
          </button>
          <button
            className="p-segmented-control__button"
            type="button"
            onClick={() => {}}
          >
            <span>Redo</span>
          </button>
        </div>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={12}>
          <InfoItem label="Description" value={activity.summary} />
        </Col>
        <Col size={12}>
          <InfoItem label="Computer" value={computer?.title ?? ""} />
        </Col>
        <Col size={6}>
          <InfoItem label="Status" value={activity.activity_status} />
        </Col>
        <Col size={6}>
          <InfoItem label="Created at" value={activity.creation_time} />
        </Col>
        <Col size={6}>
          <InfoItem label="Delivered at" value={activity.delivery_time ?? ""} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Completed at"
            value={activity.completion_time ?? ""}
          />
        </Col>
      </Row>
      <Textarea
        label="Output"
        labelClassName="p-text--small p-text--small-caps u-text--muted u-no-margin--bottom"
        rows={6}
        {...formik.getFieldProps("output")}
        error={formik.touched.output && formik.errors.output}
      />
      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          className="u-no-margin--bottom"
        >
          Save
        </Button>
        <Button
          type="button"
          onClick={closeSidePanel}
          className="u-no-margin--bottom"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ActivityDetails;
