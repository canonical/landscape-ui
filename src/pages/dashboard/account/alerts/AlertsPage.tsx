import { FC, useState } from "react";
import AlertsContainer from "./AlertsContainer";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import { Button } from "@canonical/react-components";
import useAlerts from "../../../../hooks/useAlerts";
import useConfirm from "../../../../hooks/useConfirm";
import useDebug from "../../../../hooks/useDebug";
import useNotify from "../../../../hooks/useNotify";

const AlertsPage: FC = () => {
  const debug = useDebug();
  const notify = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const { subscribeQuery, unsubscribeQuery } = useAlerts();
  const { mutateAsync: subscribeMutation, isLoading: isSubscribing } =
    subscribeQuery;
  const { mutateAsync: unsubscribeMutation, isLoading: isUnsubscribing } =
    unsubscribeQuery;

  const handleSubscriptionMutation = async (subscribe: boolean) => {
    const subscriptionMutation = subscribe
      ? subscribeMutation
      : unsubscribeMutation;
    try {
      await Promise.all(
        selectedAlerts.map(async (selectedAlert) => {
          try {
            await subscriptionMutation({
              alert_type: selectedAlert,
            });
          } catch (error) {
            debug(error);
          }
        }),
      );
      notify.success(
        `Successfully ${
          subscribe
            ? `subscribed to the alert${selectedAlerts.length === 1 ? "" : "s"}`
            : `unsubscribed from the alert${
                selectedAlerts.length === 1 ? "" : "s"
              }`
        }`,
      );
      setSelectedAlerts([]);
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSubscribeConfirmation = async () => {
    confirmModal({
      title: "Subscribing to the selected alerts",
      body: `Are you sure you want to subscribe to the alert${
        selectedAlerts.length > 1 ? "s" : ""
      }?`,
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
      title: "Unsubscribing from the selected alerts",
      body: `Are you sure you want to unsubscribe from the alert${
        selectedAlerts.length > 1 ? "s" : ""
      }?`,
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
    <PageMain>
      <PageHeader
        title="Alerts"
        actions={[
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleSubscribeConfirmation}
                disabled={isSubscribing || 0 === selectedAlerts.length}
              >
                <span>Subscribe</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleUnsubscribeConfirmation}
                disabled={isUnsubscribing || 0 === selectedAlerts.length}
              >
                <span>Unsubscribe</span>
              </Button>
            </div>
          </div>,
        ]}
      />
      <PageContent>
        <AlertsContainer
          selectedAlerts={selectedAlerts}
          setSelectedAlerts={(items) => setSelectedAlerts(items)}
        />
      </PageContent>
    </PageMain>
  );
};

export default AlertsPage;
