import { FC, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import ActivitiesContainer from "./ActivitiesContainer";
import useDebug from "../../../hooks/useDebug";
import useConfirm from "../../../hooks/useConfirm";
import useActivities from "../../../hooks/useActivities";
import { Button } from "@canonical/react-components";

const ActivitiesPage: FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();

  const { approveActivitiesQuery, cancelActivitiesQuery } = useActivities();

  const {
    mutateAsync: approveActivities,
    isLoading: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isLoading: cancelActivitiesLoading } =
    cancelActivitiesQuery;

  const handleApproveActivities = async () => {
    confirmModal({
      title: "Approve activities",
      body: "Are you sure you want to approve selected activities?",
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={async () => {
            const query = `id:${selectedIds.join(" OR id:")}`;

            try {
              await approveActivities({ query });
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
      title: "Cancel activities",
      body: "Are you sure you want to cancel selected activities?",
      buttons: [
        <Button
          key="cancel"
          appearance="negative"
          onClick={async () => {
            const query = `id:${selectedIds.join(" OR id:")}`;

            try {
              await cancelActivities({ query });
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

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        sticky
        actions={[
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleApproveActivities}
                disabled={approveActivitiesLoading || selectedIds.length === 0}
              >
                <span>Approve</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleCancelActivities}
                disabled={cancelActivitiesLoading || selectedIds.length === 0}
              >
                <span>Cancel</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={() => {}}
                disabled={selectedIds.length === 0}
              >
                <span>Undo</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={() => {}}
                disabled={selectedIds.length === 0}
              >
                <span>Redo</span>
              </button>
            </div>
          </div>,
        ]}
      />
      <PageContent>
        <ActivitiesContainer
          selectedIds={selectedIds}
          setSelectedIds={(value) => {
            setSelectedIds(value);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default ActivitiesPage;
