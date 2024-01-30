import { Button } from "@canonical/react-components";
import { FC, Suspense } from "react";
import LoadingState from "../../../../components/layout/LoadingState";
import useAlerts from "../../../../hooks/useAlerts";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Alert } from "../../../../types/Alert";
import EditAlertForm from "./EditAlertForm";

interface ShowSubscribersPanelActionButtonsProps {
  alert: Alert;
}

const ShowSubscribersPanelActionButtons: FC<
  ShowSubscribersPanelActionButtonsProps
> = ({ alert }) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { subscribeQuery, unsubscribeQuery } = useAlerts();
  const { mutateAsync: subscribeMutation } = subscribeQuery;
  const { mutateAsync: unsubscribeMutation } = unsubscribeQuery;

  const handleEditAlert = () => {
    setSidePanelContent(
      `Edit ${alert.alert_type} alert`,
      <Suspense fallback={<LoadingState />}>
        <EditAlertForm alert={alert} />
      </Suspense>,
    );
  };

  const handleSubscription = async () => {
    const subscriptionMutation = alert.subscribed
      ? unsubscribeMutation
      : subscribeMutation;
    try {
      await subscriptionMutation({
        alert_type: alert.alert_type,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
      closeSidePanel();
    }
  };

  const handleSubscribeConfirmation = async () => {
    confirmModal({
      title: "Subscribing to the selected alert",
      body: `Are you sure you want to subscribe to ${alert.alert_type}?`,
      buttons: [
        <Button
          key="subscribe"
          appearance="positive"
          onClick={handleSubscription}
        >
          Confirm
        </Button>,
      ],
    });
  };

  const handleUnsubscribeConfirmation = async () => {
    confirmModal({
      title: "Unsubscribing from the selected alert",
      body: `Are you sure you want to unsubscribe from ${alert.alert_type}?`,
      buttons: [
        <Button
          key="unsubscribe"
          appearance="positive"
          onClick={handleSubscription}
        >
          Confirm
        </Button>,
      ],
    });
  };

  return (
    <div className="p-segmented-control">
      <div className="p-segmented-control__list">
        <Button
          className="p-segmented-control__button"
          onClick={handleEditAlert}
          aria-label={`Edit ${alert.alertType} alert`}
        >
          Edit
        </Button>
        {alert.subscribed ? (
          <Button
            className="p-segmented-control__button"
            onClick={handleUnsubscribeConfirmation}
            aria-label={`Unsubscribe from ${alert.alertType} alert`}
          >
            Unsubscribe
          </Button>
        ) : (
          <Button
            className="p-segmented-control__button"
            onClick={handleSubscribeConfirmation}
            aria-label={`Subscribe to ${alert.alertType} alert`}
          >
            Subscribe
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShowSubscribersPanelActionButtons;
