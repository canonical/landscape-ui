import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CheckboxInput,
  Col,
  ConfirmationButton,
  Icon,
  ICONS,
  Row,
  Input,
  Form,
} from "@canonical/react-components";
import TagMultiSelect from "@/components/form/TagMultiSelect";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { ROOT_PATH } from "@/constants";
import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Instance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import { getInstanceInfoItems } from "./helpers";
import classes from "./InfoPanel.module.scss";
import { useFormik } from "formik";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { ModalConfirmationFormProps } from "./types";
import { useActivities } from "@/features/activities";

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
  const [instanceTags, setInstanceTags] = useState(instance.tags);

  const navigate = useNavigate();
  const debug = useDebug();
  const { openActivityDetails } = useActivities();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { removeInstancesQuery, rebootInstancesQuery, shutdownInstancesQuery } =
    useInstances();
  const { deleteChildInstancesQuery } = useWsl();
  const { editInstanceQuery } = useInstances();

  const { mutateAsync: editInstance } = editInstanceQuery;

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;
  const { mutateAsync: rebootInstances, isPending: isRebooting } =
    rebootInstancesQuery;
  const { mutateAsync: shutdownInstances, isPending: isShuttingDown } =
    shutdownInstancesQuery;
  const { mutateAsync: deleteChildInstances, isPending: isDeleting } =
    deleteChildInstancesQuery;

  const handleSubmit = async (values: ModalConfirmationFormProps) => {
    if (!values.action) {
      return;
    }

    const valuesToSubmit = {
      computer_ids: [instance.id],
      deliver_after: values.deliverImmediately
        ? undefined
        : `${values.deliver_after}:00Z`,
    };

    try {
      const { data: activity } =
        values.action === "reboot"
          ? await rebootInstances(valuesToSubmit)
          : await shutdownInstances(valuesToSubmit);

      const notificationVerb =
        values.action === "reboot" ? "restarted" : "shut down";

      notify.success({
        title: `You queued "${instance.title}" to be ${notificationVerb}`,
        message: `Instance "${instance.title}" will be ${notificationVerb} and is queued in Activities`,
        actions: [
          {
            label: "View details",
            onClick: () => openActivityDetails(activity),
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

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

  const handleRemoveInstance = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      navigate(`${ROOT_PATH}instances`, { replace: true });
    } catch (error) {
      debug(error);
    }
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

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });

      navigate(`${ROOT_PATH}instances`, { replace: true });
    } catch (error) {
      debug(error);
    }
  };

  const handleFormSubmit = async (action: "reboot" | "shutdown") => {
    await formik.setFieldValue("action", action);
    formik.handleSubmit();
  };

  return (
    <>
      <div className={classes.titleRow}>
        <div className={classes.flexContainer}>
          <h2 className="p-heading--4 u-no-padding--top u-no-margin--bottom">
            {instance.title}
          </h2>
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
            <ConfirmationButton
              className="u-no-margin--bottom u-no-margin--right"
              type="button"
              confirmationModalProps={{
                title: "Delete instance",
                children: (
                  <p>
                    This will permanently delete the instance{" "}
                    <b>{instance.title}</b> from both the Windows host machine
                    and Landscape.
                  </p>
                ),
                confirmButtonLabel: "Delete",
                confirmButtonAppearance: "negative",
                confirmButtonDisabled: isDeleting,
                confirmButtonLoading: isDeleting,
                onConfirm: handleDeleteChildInstances,
              }}
            >
              Delete instance
            </ConfirmationButton>
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

              <ConfirmationButton
                className="p-segmented-control__button u-no-margin--bottom has-icon"
                type="button"
                disabled={isRemoving}
                confirmationModalProps={{
                  title: "Remove instance from Landscape",
                  children: (
                    <p>
                      This will remove the instance <b>{instance.title}</b> from
                      Landscape.
                      <br />
                      <br />
                      It will remain on the parent machine. You can re-register
                      it to Landscape at any time.
                    </p>
                  ),
                  confirmButtonLabel: "Remove",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isRemoving,
                  confirmButtonLoading: isRemoving,
                  onConfirm: handleRemoveInstance,
                }}
              >
                <Icon name={ICONS.delete} />
                <span>Remove from Landscape</span>
              </ConfirmationButton>
              <ConfirmationButton
                className="p-segmented-control__button u-no-margin--bottom has-icon"
                type="button"
                disabled={isRemoving}
                confirmationModalProps={{
                  title: "Restart instance",
                  children: (
                    <Form
                      onSubmit={() => handleFormSubmit("reboot")}
                      noValidate
                    >
                      <CheckboxInput
                        label="Deliver as soon as possible"
                        {...formik.getFieldProps("deliverImmediately")}
                        checked={formik.values.deliverImmediately}
                      />
                      <Input
                        type="datetime-local"
                        label="Schedule time"
                        labelClassName="u-off-screen"
                        className={classes.input}
                        placeholder="Scheduled time"
                        {...formik.getFieldProps("deliver_after")}
                        disabled={formik.values.deliverImmediately}
                        error={
                          formik.touched.deliver_after &&
                          formik.errors.deliver_after
                            ? formik.errors.deliver_after
                            : undefined
                        }
                      />
                      <p>
                        This will restart &quot;{instance.title}&quot; instance.
                      </p>
                    </Form>
                  ),
                  confirmButtonLabel: "Restart",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isRebooting,
                  confirmButtonLoading: isRebooting,
                  onConfirm: () => handleFormSubmit("reboot"),
                }}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </ConfirmationButton>
              <ConfirmationButton
                className="p-segmented-control__button u-no-margin--bottom has-icon"
                type="button"
                disabled={isRemoving}
                confirmationModalProps={{
                  title: "Shut down instance",
                  children: (
                    <Form
                      onSubmit={() => handleFormSubmit("shutdown")}
                      noValidate
                    >
                      <CheckboxInput
                        label="Deliver as soon as possible"
                        {...formik.getFieldProps("deliverImmediately")}
                        checked={formik.values.deliverImmediately}
                      />
                      <Input
                        type="datetime-local"
                        label="Schedule time"
                        labelClassName="u-off-screen"
                        className={classes.input}
                        placeholder="Scheduled time"
                        {...formik.getFieldProps("deliver_after")}
                        disabled={formik.values.deliverImmediately}
                        error={
                          formik.touched.deliver_after &&
                          formik.errors.deliver_after
                            ? formik.errors.deliver_after
                            : undefined
                        }
                      />
                      <p>
                        This will shut down &quot;{instance.title}&quot;
                        instance.
                      </p>
                    </Form>
                  ),
                  confirmButtonLabel: "Shutdown",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isShuttingDown,
                  confirmButtonLoading: isShuttingDown,
                  onConfirm: () => handleFormSubmit("shutdown"),
                }}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </ConfirmationButton>
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
    </>
  );
};

export default InfoPanel;
