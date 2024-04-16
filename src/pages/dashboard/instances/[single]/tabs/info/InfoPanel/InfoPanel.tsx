import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { useWsl } from "@/hooks/useWsl";
import ActivityConfirmation from "@/pages/dashboard/instances/[single]/tabs/info/ActivityConfirmation";
import { ActivityProps } from "@/pages/dashboard/instances/[single]/tabs/info/types";
import { Instance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import { getInstanceInfoItems } from "./helpers";
import classes from "./InfoPanel.module.scss";

const EditInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/info/EditInstance"),
);
const RunScriptForm = lazy(
  () => import("@/pages/dashboard/instances/RunScriptForm"),
);

interface InfoPanelProps {
  instance: Instance;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  const [scheduleTime, setScheduleTime] = useState("");
  const [deliverImmediately, setDeliverImmediately] = useState(true);
  const [activityProps, setActivityProps] = useState<ActivityProps | null>(
    null,
  );

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();
  const { rebootInstancesQuery, removeInstancesQuery, shutdownInstancesQuery } =
    useInstances();
  const { getAccessGroupQuery } = useRoles();
  const { deleteChildInstancesQuery } = useWsl();

  const { data: getAccessGroupQueryResult, error: getAccessGroupQueryError } =
    getAccessGroupQuery();

  if (getAccessGroupQueryError) {
    debug(getAccessGroupQueryError);
  }

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: rebootInstances, isLoading: rebootInstancesLoading } =
    rebootInstancesQuery;
  const { mutateAsync: removeInstances, isLoading: removeInstancesLoading } =
    removeInstancesQuery;
  const {
    mutateAsync: shutdownInstances,
    isLoading: shutdownInstancesLoading,
  } = shutdownInstancesQuery;

  const getDeliverDelay = () => {
    if (deliverImmediately) {
      return;
    }

    return new Date(scheduleTime).toISOString().replace(/\.\d*(?=Z$)/, "");
  };

  const handleShutdownInstance = async () => {
    try {
      await shutdownInstances({
        computer_ids: [instance.id],
        deliver_after: getDeliverDelay(),
      });
    } catch (error) {
      debug(error);
    } finally {
      setActivityProps(null);
    }
  };

  const handleShutdownInstanceDialog = () => {
    setActivityProps({
      title: `Shut down ${instance.title}`,
      description: "Are you sure you want to shut down this instance?",
      acceptButton: {
        label: "Shutdown",
        onClick: handleShutdownInstance,
      },
    });
  };

  const handleRebootInstance = async () => {
    try {
      await rebootInstances({
        computer_ids: [instance.id],
        deliver_after: getDeliverDelay(),
      });
    } catch (error) {
      debug(error);
    } finally {
      setActivityProps(null);
    }
  };

  const handleRebootInstanceDialog = () => {
    setActivityProps({
      title: `Restart ${instance.title}`,
      description: "Are you sure you want to restart this instance?",
      acceptButton: {
        label: "Restart",
        onClick: handleRebootInstance,
      },
    });
  };

  const handleRemoveInstance = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveInstanceDialog = () => {
    confirmModal({
      title: `Remove ${instance.title}`,
      body: "Removing this instance will delete all associated data and free up one license slot for another instance to be registered.",
      buttons: [
        <Button
          key="remove"
          appearance="negative"
          onClick={handleRemoveInstance}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleEditInstance = () => {
    setSidePanelContent(
      "Edit Instance",
      <Suspense fallback={<LoadingState />}>
        <EditInstance instance={instance} />
      </Suspense>,
    );
  };

  const handleRunScript = () => {
    setSidePanelContent(
      "Run script",
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm query={`id:${instance.id}`} />
      </Suspense>,
    );
  };

  const handleCloseActivityConfirmation = () => {
    setScheduleTime("");
    setDeliverImmediately(true);
    setActivityProps(null);
  };

  const { mutateAsync: deleteChildInstances } = deleteChildInstancesQuery;

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleDeleteChildInstancesDialog = async () => {
    confirmModal({
      title: `Delete ${instance.title}`,
      body: "This will remove selected WSL instance from the host and Landscape",
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          onClick={handleDeleteChildInstances}
        >
          Uninstall
        </Button>,
      ],
    });
  };

  return (
    <>
      <div className={classes.titleRow}>
        <div className={classes.flexContainer}>
          <p className="p-heading--4 u-no-padding--top u-no-margin--bottom">
            {instance.title}
          </p>
          {instance.is_wsl_instance && (
            <p
              className={classNames(
                "u-text--muted u-no-margin--bottom",
                classes.italic,
              )}
            >
              WSL Instance
            </p>
          )}
        </div>
        <div className={classes.flexContainer}>
          {instance.is_wsl_instance && (
            <Button
              type="button"
              className="u-no-margin--bottom u-no-margin--right"
              onClick={handleDeleteChildInstancesDialog}
            >
              Uninstall WSL Instance
            </Button>
          )}
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleEditInstance}
              >
                <Icon name="edit" />
                <span>Edit</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleRunScript}
              >
                <Icon name="code" />
                <span>Run script</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleRemoveInstanceDialog}
                disabled={removeInstancesLoading}
              >
                <Icon name="delete" />
                <span>Remove</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleRebootInstanceDialog}
                disabled={rebootInstancesLoading}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleShutdownInstanceDialog}
                disabled={shutdownInstancesLoading}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.infoRow}>
        <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
          {getInstanceInfoItems(instance, accessGroupOptions).map((item) => (
            <Col size={4} key={item.label}>
              {!item.type && <InfoItem label={item.label} value={item.value} />}
            </Col>
          ))}
        </Row>
      </div>

      <ActivityConfirmation
        onClose={handleCloseActivityConfirmation}
        checkboxValue={deliverImmediately}
        onCheckboxChange={() => {
          setDeliverImmediately((prevState) => !prevState);
        }}
        inputValue={scheduleTime}
        onInputChange={(value) => {
          setScheduleTime(value);
        }}
        activityProps={activityProps}
      />
    </>
  );
};

export default InfoPanel;
