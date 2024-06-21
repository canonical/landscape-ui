import { Button } from "@canonical/react-components";
import { FC, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import useAlerts from "@/hooks/useAlerts";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { Alert } from "@/types/Alert";
import EditAlertForm from "../EditAlertForm";
import useNotify from "@/hooks/useNotify";

interface AlertButtonsProps {
  alerts: Alert[];
  setSelectedAlerts?: (alerts: string[]) => void;
}

const AlertButtons: FC<AlertButtonsProps> = ({ alerts, setSelectedAlerts }) => {
  const { notify } = useNotify();
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { subscribeQuery, unsubscribeQuery } = useAlerts();
  const { mutateAsync: subscribeMutation, isLoading: isSubscribing } =
    subscribeQuery;
  const { mutateAsync: unsubscribeMutation, isLoading: isUnsubscribing } =
    unsubscribeQuery;

  const selectedAlert = alerts[0];
  const isSingleAlert = alerts.length === 1;

  const handleEditAlert = () => {
    setSidePanelContent(
      `Edit ${selectedAlert.label}`,
      <Suspense fallback={<LoadingState />}>
        <EditAlertForm alert={selectedAlert} />
      </Suspense>,
    );
  };

  const handleSubscriptionMutation = async (subscribe: boolean) => {
    const subscriptionMutation = subscribe
      ? subscribeMutation
      : unsubscribeMutation;
    try {
      await Promise.all(
        alerts.map(async (alert) => {
          try {
            await subscriptionMutation({
              alert_type: alert.alert_type,
            });
          } catch (error) {
            debug(error);
          }
        }),
      );
      notify.success({
        message: `Successfully ${
          subscribe
            ? `subscribed to the alert${!isSingleAlert ? "s" : ` ${selectedAlert.label}`}`
            : `unsubscribed from the alert${!isSingleAlert ? "s" : ` ${selectedAlert.label}`}`
        }`,
      });
      if (setSelectedAlerts) {
        setSelectedAlerts([]);
      }
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
      closeSidePanel();
    }
  };

  const handleSubscribeConfirmation = async () => {
    confirmModal({
      title: `Subscribing to the selected alert${isSingleAlert ? "" : "s"}`,
      body: `Are you sure you want to subscribe to ${isSingleAlert ? selectedAlert.label : "the alerts"}?`,
      buttons: [
        <Button
          disabled={isSubscribing}
          key="subscribe"
          appearance="positive"
          onClick={() => handleSubscriptionMutation(true)}
        >
          Confirm
        </Button>,
      ],
    });
  };

  const handleUnsubscribeConfirmation = async () => {
    confirmModal({
      title: `Unsubscribing from the selected alert${isSingleAlert ? "" : "s"}`,
      body: `Are you sure you want to unsubscribe from ${isSingleAlert ? selectedAlert.label : "the alerts"}?`,
      buttons: [
        <Button
          disabled={isUnsubscribing}
          key="unsubscribe"
          appearance="positive"
          onClick={() => handleSubscriptionMutation(false)}
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
          aria-label={`Edit ${selectedAlert.label}`}
        >
          Edit
        </Button>
        {selectedAlert.subscribed ? (
          <Button
            className="p-segmented-control__button"
            onClick={handleUnsubscribeConfirmation}
            aria-label={`Unsubscribe from ${selectedAlert.label}`}
          >
            Unsubscribe
          </Button>
        ) : (
          <Button
            className="p-segmented-control__button"
            onClick={handleSubscribeConfirmation}
            aria-label={`Subscribe to ${selectedAlert.label}`}
          >
            Subscribe
          </Button>
        )}
      </div>
    </div>
  );
};

export default AlertButtons;
