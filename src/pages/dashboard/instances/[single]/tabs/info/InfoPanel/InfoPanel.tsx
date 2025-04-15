import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  CheckboxInput,
  Col,
  ConfirmationButton,
  Form,
  Icon,
  ICONS,
  Input,
  Row,
} from "@canonical/react-components";
import TagMultiSelect from "@/components/form/TagMultiSelect";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";
import { getInstanceInfoItems } from "./helpers";
import classes from "./InfoPanel.module.scss";
import { useFormik } from "formik";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { ModalConfirmationFormProps } from "./types";
import { useActivities } from "@/features/activities";
import { currentInstanceCan } from "@/features/instances";
import { getFormikError } from "@/utils/formikErrors";

const EditInstance = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/info/EditInstance"),
);
const RunInstanceScriptForm = lazy(() =>
  import("@/features/scripts").then((module) => ({
    default: module.RunInstanceScriptForm,
  })),
);
const AssignEmployeeToInstanceForm = lazy(
  () => import("../AssignEmployeeToInstanceForm"),
);

interface InfoPanelProps {
  readonly instance: Instance;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  const [instanceTags, setInstanceTags] = useState(instance.tags);

  const navigate = useNavigate();
  const debug = useDebug();
  const { openActivityDetails } = useActivities();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const {
    removeInstancesQuery,
    rebootInstancesQuery,
    sanitizeInstanceQuery,
    shutdownInstancesQuery,
  } = useInstances();
  const { deleteChildInstancesQuery } = useWsl();
  const { editInstanceQuery } = useInstances();

  useEffect(() => {
    setInstanceTags(instance.tags);
  }, [instance.tags]);

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: editInstance } = editInstanceQuery;
  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;
  const { mutateAsync: rebootInstances, isPending: isRebooting } =
    rebootInstancesQuery;
  const { mutateAsync: shutdownInstances, isPending: isShuttingDown } =
    shutdownInstancesQuery;
  const { mutateAsync: deleteChildInstances, isPending: isDeleting } =
    deleteChildInstancesQuery;
  const { mutateAsync: sanitizeInstance, isPending: isSanitizing } =
    sanitizeInstanceQuery;

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

  const removeInstancesFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: () => handleRemoveInstance(),
  });

  const sanitizeInstanceFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: () => handleSanitizeInstance(),
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

      navigate("/instances", { replace: true });
    } catch (error) {
      debug(error);
    }
  };

  const handleSanitizeInstance = async () => {
    try {
      const { data: sanitizeActivity } = await sanitizeInstance({
        computer_id: instance.id,
        computer_title: instance.title,
      });

      notify.success({
        title: `You have successfully initiated Sanitization for ${instance.title}`,
        message: `Sanitizing for ${instance.title} has been queued in Activities. The data will be permanently irrecoverable once complete.`,
        actions: [
          {
            label: "View details",
            onClick: () => openActivityDetails(sanitizeActivity),
          },
        ],
      });
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

  const handleAssociateEmployee = () => {
    setSidePanelContent(
      `Associate Employee with ${instance.title}`,
      <Suspense fallback={<LoadingState />}>
        <AssignEmployeeToInstanceForm
          instanceTitle={instance.title}
          employeeId={instance.employee_id}
        />
      </Suspense>,
    );
  };

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });

      navigate("/instances", { replace: true });
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
              {currentInstanceCan("runScripts", instance) && (
                <Button
                  className="p-segmented-control__button u-no-margin--bottom"
                  type="button"
                  onClick={handleRunScript}
                >
                  <Icon name="code" />
                  <span>Run script</span>
                </Button>
              )}

              <ConfirmationButton
                className="p-segmented-control__button u-no-margin--bottom has-icon"
                type="button"
                disabled={isRemoving}
                confirmationModalProps={{
                  title: "Remove instance from Landscape",
                  children: (
                    <Form onSubmit={formik.handleSubmit} noValidate>
                      <p>
                        Removing this {instance.title} will delete all
                        associated data and free up one license slot for another
                        computer to be registered.
                      </p>
                      <p>
                        Type <b>remove {instance.title}</b> to confirm.
                      </p>
                      <Input
                        type="text"
                        {...removeInstancesFormik.getFieldProps(
                          "confirmationText",
                        )}
                      />
                    </Form>
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
                disabled={isSanitizing}
                confirmationModalProps={{
                  title: "Sanitize instance",
                  children: (
                    <Form
                      onSubmit={sanitizeInstanceFormik.handleSubmit}
                      noValidate
                    >
                      <p>
                        Sanitization will permanently delete the encryption keys
                        for {instance.title}, making its data completely
                        irrecoverable. This action cannot be undone. Please
                        confirm your wish to proceed.
                      </p>
                      <p>
                        Type <b>sanitize {instance.title}</b> to confirm.
                      </p>
                      <Input
                        type="text"
                        {...sanitizeInstanceFormik.getFieldProps(
                          "confirmationText",
                        )}
                      />
                    </Form>
                  ),
                  confirmButtonLabel: "Sanitize",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled:
                    isSanitizing ||
                    sanitizeInstanceFormik.values.confirmationText !==
                      `sanitize ${instance.title}`,
                  confirmButtonLoading: isSanitizing,
                  onConfirm: handleSanitizeInstance,
                }}
              >
                <Icon name="tidy" />
                <span>Sanitize</span>
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
                        error={getFormikError(formik, "deliver_after")}
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
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleAssociateEmployee}
              >
                <Icon name={ICONS.user} />
                <span>Associate employee</span>
              </Button>
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
                        error={getFormikError(formik, "deliver_after")}
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
