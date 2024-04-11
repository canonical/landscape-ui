import { FC, lazy, Suspense, useEffect, useState } from "react";
import { InstanceWithoutRelation } from "@/types/Instance";
import useDebug from "@/hooks/useDebug";
import useConfirm from "@/hooks/useConfirm";
import useInstances from "@/hooks/useInstances";
import {
  Button,
  Chip,
  Col,
  Icon,
  Input,
  Row,
  Select,
  Textarea,
} from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./InfoPanel.module.scss";
import InfoItem, { InfoItemProps } from "@/components/layout/InfoItem";
import classNames from "classnames";
import useRoles from "@/hooks/useRoles";
import { SelectOption } from "@/types/SelectOption";
import ActivityConfirmation, { ActivityProps } from "./ActivityConfirmation";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useWsl } from "@/hooks/useWsl";

const EditInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/info/EditInstance"),
);

const RunScriptForm = lazy(
  () => import("@/pages/dashboard/instances/RunScriptForm"),
);

interface InfoPanelProps {
  instance: InstanceWithoutRelation;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  const [scheduleTime, setScheduleTime] = useState("");
  const [deliverImmediately, setDeliverImmediately] = useState(true);
  const [newTagsString, setNewTagsString] = useState("");
  const [currentAccessGroup, setCurrentAccessGroup] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [activityProps, setActivityProps] = useState<ActivityProps | null>(
    null,
  );

  useEffect(() => {
    if (!instance) {
      return;
    }

    setCurrentAccessGroup(instance.access_group);
    setCurrentComment(instance.comment);
  }, [instance]);

  const debug = useDebug();

  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();

  const {
    rebootInstancesQuery,
    removeInstancesQuery,
    shutdownInstancesQuery,
    addTagsToInstancesQuery,
    removeTagsFromInstancesQuery,
    changeInstancesAccessGroupQuery,
  } = useInstances();

  const { getAccessGroupQuery } = useRoles();

  const { deleteChildInstancesQuery } = useWsl();

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
        <EditInstance instance={instance} license="" />
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

  const infoItems: InfoItemProps[] = [
    {
      label: "Last ping time",
      value: moment(instance.last_ping_time).format(DISPLAY_DATE_TIME_FORMAT),
    },
    {
      label: "Registered",
      value: "None",
    },
    {
      label: "Distribution",
      value: instance.distribution ?? "-",
    },
    {
      label: "Serial number",
      value: "None",
    },
    {
      label: "Product identifier",
      value: "None",
    },
    {
      label: "Annotations",
      value: instance.annotations
        ? Object.entries(instance.annotations)
            .map(([key, value]) => `${key}: ${value}`)
            .join("<br/>")
        : "Not defined",
    },
  ];

  const {
    mutateAsync: addTagsToInstances,
    isLoading: addTagsToInstancesLoading,
  } = addTagsToInstancesQuery;
  const {
    mutateAsync: removeTagsFromInstances,
    isLoading: removeTagsFromInstancesLoading,
  } = removeTagsFromInstancesQuery;

  const handleAddTags = async () => {
    try {
      await addTagsToInstances({
        query: `id:${instance.id}`,
        tags: newTagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      await removeTagsFromInstances({
        query: `id:${instance.id}`,
        tags: [tag],
      });
    } catch (error) {
      debug(error);
    }
  };

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

  const {
    mutateAsync: changeInstancesAccessGroup,
    isLoading: changeInstancesAccessGroupLoading,
  } = changeInstancesAccessGroupQuery;

  const handleUpdateAccessGroup = async () => {
    try {
      await changeInstancesAccessGroup({
        query: `id:${instance.id}`,
        access_group: currentAccessGroup,
      });
    } catch (error) {
      debug(error);
    }
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
          {infoItems.map((item) => (
            <Col size={3} key={item.label}>
              {!item.type && <InfoItem label={item.label} value={item.value} />}
            </Col>
          ))}
        </Row>
      </div>

      <div className={classes.inputs}>
        <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
          <Col size={6}>
            <Row>
              <Col size={4}>
                <Select
                  label="Access group"
                  labelClassName={classNames(
                    "p-text--small p-text--small-caps u-text--muted",
                    classes.inputLabel,
                  )}
                  options={accessGroupOptions}
                  value={currentAccessGroup}
                  onChange={(event) => {
                    setCurrentAccessGroup(event.target.value);
                  }}
                />
              </Col>
              <Col size={2} className={classes.inputButton}>
                <Button
                  disabled={
                    instance.access_group === currentAccessGroup ||
                    changeInstancesAccessGroupLoading
                  }
                  onClick={handleUpdateAccessGroup}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Col>
          <Col size={6}>
            <Row>
              <Col size={4}>
                <Select
                  label="License"
                  wrapperClassName={classes.input}
                  labelClassName={classNames(
                    "p-text--small p-text--small-caps u-text--muted",
                    classes.inputLabel,
                  )}
                  options={[
                    {
                      label: "Landscape, 234 days left, 9 seats free",
                      value: "landscape-annual-10",
                    },
                  ]}
                />
              </Col>
              <Col size={2} className={classes.inputButton}>
                <Button>Update</Button>
              </Col>
            </Row>
          </Col>
          <Col size={6}>
            <Row>
              <Col size={4}>
                <Input
                  label="Tags"
                  aria-label="Tags"
                  type="text"
                  onChange={(e) => setNewTagsString(e.target.value)}
                  labelClassName={classNames(
                    "p-text--small p-text--small-caps u-text--muted",
                    classes.inputLabel,
                  )}
                />
              </Col>
              <Col size={2} className={classes.inputButton}>
                <Button
                  onClick={handleAddTags}
                  disabled={addTagsToInstancesLoading || !newTagsString}
                >
                  Add
                </Button>
              </Col>
            </Row>
            {instance.tags.length > 0 && (
              <div className={classes.tags}>
                <Row>
                  <Col size={4}>
                    {instance.tags.map((tag) => (
                      <Chip
                        value={tag}
                        key={tag}
                        className="u-no-margin--bottom"
                        disabled={removeTagsFromInstancesLoading}
                        onDismiss={async () => {
                          await handleRemoveTag(tag);
                        }}
                      />
                    ))}
                  </Col>
                </Row>
              </div>
            )}
          </Col>
          <Col size={6}>
            <Row>
              <Col size={4}>
                <Textarea
                  label="Comment"
                  rows={4}
                  labelClassName={classNames(
                    "p-text--small p-text--small-caps u-text--muted",
                    classes.inputLabel,
                  )}
                  value={currentComment}
                  onChange={(e) => setCurrentComment(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
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
