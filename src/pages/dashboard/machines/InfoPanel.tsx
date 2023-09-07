import { FC, Suspense, useEffect, useState } from "react";
import { Computer } from "../../../types/Computer";
import useDebug from "../../../hooks/useDebug";
import useConfirm from "../../../hooks/useConfirm";
import useComputers from "../../../hooks/useComputers";
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
import useSidePanel from "../../../hooks/useSidePanel";
import LoadingState from "../../../components/layout/LoadingState";
import EditComputer from "./EditComputer";
import classes from "./InfoPanel.module.scss";
import InfoItem, { InfoItemProps } from "../../../components/layout/InfoItem";
import classNames from "classnames";
import useAccessGroup from "../../../hooks/useAccessGroup";
import { SelectOption } from "../../../types/SelectOption";
import ActivityConfirmation, { ActivityProps } from "./ActivityConfirmation";

interface InfoPanelProps {
  machine: Computer;
}

const InfoPanel: FC<InfoPanelProps> = ({ machine }) => {
  const [scheduleTime, setScheduleTime] = useState("");
  const [deliverImmediately, setDeliverImmediately] = useState(true);
  const [newTagsString, setNewTagsString] = useState("");
  const [currentAccessGroup, setCurrentAccessGroup] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [activityProps, setActivityProps] = useState<ActivityProps | null>(
    null
  );

  useEffect(() => {
    if (!machine) {
      return;
    }

    setCurrentAccessGroup(machine.access_group);
    setCurrentComment(machine.comment);
  }, [machine]);

  const debug = useDebug();

  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  const {
    rebootComputersQuery,
    removeComputersQuery,
    shutdownComputersQuery,
    addTagsToComputersQuery,
    removeTagsFromComputersQuery,
    changeComputersAccessGroupQuery,
  } = useComputers();

  const { getAccessGroupQuery } = useAccessGroup();

  const { mutateAsync: rebootComputers, isLoading: rebootComputersLoading } =
    rebootComputersQuery;
  const { mutateAsync: removeComputers, isLoading: removeComputersLoading } =
    removeComputersQuery;
  const {
    mutateAsync: shutdownComputers,
    isLoading: shutdownComputersLoading,
  } = shutdownComputersQuery;

  const getDeliverDelay = () => {
    if (deliverImmediately) {
      return;
    }

    return new Date(scheduleTime).toISOString().replace(/\.\d*(?=Z$)/, "");
  };

  const handleShutdownComputer = async () => {
    setActivityProps({
      title: `Shut down ${machine.title}`,
      description: "Are you sure you want to shut down this machine?",
      acceptButton: {
        label: "Shutdown",
        onClick: async () => {
          try {
            await shutdownComputers({
              computer_ids: [machine.id],
              deliver_after: getDeliverDelay(),
            });
          } catch (error) {
            debug(error);
          } finally {
            setActivityProps(null);
          }
        },
      },
    });
  };

  const handleRebootComputer = async () => {
    setActivityProps({
      title: `Restart ${machine.title}`,
      description: "Are you sure you want to restart this machine?",
      acceptButton: {
        label: "Restart",
        onClick: async () => {
          try {
            await rebootComputers({
              computer_ids: [machine.id],
              deliver_after: getDeliverDelay(),
            });
          } catch (error) {
            debug(error);
          } finally {
            setActivityProps(null);
          }
        },
      },
    });
  };

  const handleRemoveComputer = async () => {
    confirmModal({
      title: `Remove ${machine.title}`,
      body: `Removing this computer will delete all associated data and free up one license slot for another computer to be registered.`,
      buttons: [
        <Button
          key="remove"
          appearance="negative"
          onClick={async () => {
            try {
              await removeComputers({
                computer_ids: [machine.id],
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handleEditComputer = async () => {
    setSidePanelOpen(true);
    setSidePanelContent(
      "Edit Computer",
      <Suspense fallback={<LoadingState />}>
        <EditComputer computer={machine} license="" />
      </Suspense>
    );
  };

  const infoItems: InfoItemProps[] = [
    {
      label: "Last ping time",
      value: new Date(machine.last_ping_time).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        timeZone: "UTC",
      }),
    },
    {
      label: "Registered",
      value: "None",
    },
    {
      label: "Distribution",
      value: machine.distribution,
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
      value: machine.annotations
        ? Object.entries(machine.annotations)
            .map(([key, value]) => `${key}: ${value}`)
            .join("<br/>")
        : "Not defined",
    },
  ];

  const {
    mutateAsync: addTagsToComputers,
    isLoading: addTagsToComputersLoading,
  } = addTagsToComputersQuery;
  const {
    mutateAsync: removeTagsFromComputers,
    isLoading: removeTagsFromComputersLoading,
  } = removeTagsFromComputersQuery;

  const handleAddTags = async () => {
    try {
      await addTagsToComputers({
        query: `id:${machine.id}`,
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
      await removeTagsFromComputers({
        query: `id:${machine.id}`,
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
    mutateAsync: changeComputersAccessGroup,
    isLoading: changeComputersAccessGroupLoading,
  } = changeComputersAccessGroupQuery;

  const handleUpdateAccessGroup = async () => {
    try {
      await changeComputersAccessGroup({
        query: `id:${machine.id}`,
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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "1.5rem",
        }}
      >
        <h3>{machine.title}</h3>
        <div key="buttons" className="p-segmented-control">
          <div className="p-segmented-control__list">
            <button
              className="p-segmented-control__button"
              type="button"
              onClick={handleEditComputer}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </button>
            <button
              className="p-segmented-control__button"
              type="button"
              onClick={handleRemoveComputer}
              disabled={removeComputersLoading}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </button>
            <button
              className="p-segmented-control__button"
              type="button"
              onClick={handleRebootComputer}
              disabled={rebootComputersLoading}
            >
              <Icon name="restart" />
              <span>Restart</span>
            </button>
            <button
              className="p-segmented-control__button"
              type="button"
              onClick={handleShutdownComputer}
              disabled={shutdownComputersLoading}
            >
              <Icon name="power-off" />
              <span>Shutdown</span>
            </button>
          </div>
        </div>
      </div>
      <div className={classes.infoRow}>
        <Row className="u-no-padding--left u-no-padding--right">
          {infoItems.map(({ label, value }) => (
            <Col size={3} key={label}>
              <InfoItem label={label} value={value} />
            </Col>
          ))}
        </Row>
      </div>

      <div className={classes.inputs}>
        <Row className="u-no-padding--left u-no-padding--right">
          <Col size={6}>
            <Row>
              <Col size={4}>
                <Select
                  label="Access group"
                  labelClassName={classNames(
                    "p-text--small p-text--small-caps u-text--muted",
                    classes.inputLabel
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
                    machine.access_group === currentAccessGroup ||
                    changeComputersAccessGroupLoading
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
                    classes.inputLabel
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
                    classes.inputLabel
                  )}
                />
              </Col>
              <Col size={2} className={classes.inputButton}>
                <Button
                  onClick={handleAddTags}
                  disabled={addTagsToComputersLoading || !newTagsString}
                >
                  Add
                </Button>
              </Col>
            </Row>
            {machine.tags.length > 0 && (
              <div className={classes.tags}>
                <Row>
                  <Col size={4}>
                    {machine.tags.map((tag) => (
                      <Chip
                        value={tag}
                        key={tag}
                        className="u-no-margin--bottom"
                        disabled={removeTagsFromComputersLoading}
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
                    classes.inputLabel
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
