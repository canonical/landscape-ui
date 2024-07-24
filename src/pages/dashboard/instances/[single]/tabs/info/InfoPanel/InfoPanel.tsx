import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import TagMultiSelect from "@/components/form/TagMultiSelect";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { ROOT_PATH } from "@/constants";
import { useWsl } from "@/features/wsl";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import ActivityConfirmation from "@/pages/dashboard/instances/[single]/tabs/info/ActivityConfirmation";
import { Instance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import { getInstanceInfoItems } from "./helpers";
import classes from "./InfoPanel.module.scss";

const EditInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/info/EditInstance"),
);
const RunInstanceScriptForm = lazy(() =>
  import("@/features/scripts").then((module) => ({
    default: module.RunInstanceScriptForm,
  })),
);

interface InfoPanelProps {
  instance: Instance;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  const [instanceAction, setInstanceAction] = useState<
    "reboot" | "shutdown" | null
  >(null);
  const [instanceTags, setInstanceTags] = useState(instance.tags);

  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();
  const { removeInstancesQuery } = useInstances();
  const { getAccessGroupQuery } = useRoles();
  const { deleteChildInstancesQuery } = useWsl();
  const { editInstanceQuery } = useInstances();

  const { mutateAsync: editInstance } = editInstanceQuery;

  const handleTagsUpdate = async () => {
    try {
      await editInstance({
        instanceId: instance.id,
        tags: instanceTags,
      });

      notify.success({
        title: "Tags updated",
        message: `"${instance.title}" instance tags have been updated successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: removeInstances, isLoading: removeInstancesLoading } =
    removeInstancesQuery;

  const handleRemoveInstance = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      navigate(`${ROOT_PATH}instances`, { replace: true });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveInstanceDialog = () => {
    confirmModal({
      title: "Remove instance from Landscape",
      body: (
        <p>
          This will remove the instance <b>{instance.title}</b> from Landscape.
          <br />
          <br />
          It will remain on the parent machine. You can re-register it to
          Landscape at any time.
        </p>
      ),
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
        <RunInstanceScriptForm query={`id:${instance.id}`} />
      </Suspense>,
    );
  };

  const { mutateAsync: deleteChildInstances } = deleteChildInstancesQuery;

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });

      navigate(`${ROOT_PATH}instances`, { replace: true });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleDeleteChildInstancesDialog = async () => {
    confirmModal({
      title: "Delete instance",
      body: (
        <p>
          This will permanently delete the instance <b>{instance.title}</b> from
          both the Windows host machine and Landscape.
        </p>
      ),
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          onClick={handleDeleteChildInstances}
        >
          Delete
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
              Delete instance
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
                <span>Remove from Landscape</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={() => setInstanceAction("reboot")}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </Button>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={() => setInstanceAction("shutdown")}
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
              <InfoItem {...item} />
            </Col>
          ))}
        </Row>
      </div>

      <div className={classes.tagSection}>
        <Row className={classes.tagsRow}>
          <Col size={4}>
            <TagMultiSelect
              labelClassName="p-text--small p-text--small-caps u-text--muted"
              onTagsChange={(value) => setInstanceTags(value)}
              tags={instanceTags}
            />
          </Col>
          <Col size={2} className={classes.tagsButton}>
            <Button
              type="button"
              className="u-no-margin--bottom"
              onClick={handleTagsUpdate}
            >
              Update
            </Button>
          </Col>
        </Row>
      </div>

      {instanceAction && (
        <ActivityConfirmation
          action={instanceAction}
          instance={instance}
          onClose={() => setInstanceAction(null)}
        />
      )}
    </>
  );
};

export default InfoPanel;
