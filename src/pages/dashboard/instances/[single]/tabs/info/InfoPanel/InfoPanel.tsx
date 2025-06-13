import TagMultiSelect from "@/components/form/TagMultiSelect";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { useActivities } from "@/features/activities";
import {
  currentInstanceCan,
  TagsAddConfirmationModal,
  useTaggedSecurityProfiles,
} from "@/features/instances";
import { useWsl } from "@/features/wsl";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  CheckboxInput,
  Col,
  ConfirmationButton,
  ConfirmationModal,
  Form,
  Icon,
  ICONS,
  Input,
  Row,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import type { FC } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { getInstanceInfoItems } from "./helpers";
import classes from "./InfoPanel.module.scss";
import type { ModalConfirmationFormProps } from "./types";
import { ResponsiveButtons } from "@/components/ui";

const EditInstance = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/info/EditInstance"),
);
const RunInstanceScriptForm = lazy(async () =>
  import("@/features/scripts").then((module) => ({
    default: module.RunInstanceScriptForm,
  })),
);

const AssignEmployeeToInstanceForm = lazy(
  async () => import("../AssignEmployeeToInstanceForm"),
);

interface InfoPanelProps {
  readonly instance: Instance;
}

const InfoPanel: FC<InfoPanelProps> = ({ instance }) => {
  const [instanceTags, setInstanceTags] = useState([...instance.tags]);
  const [isModalVisible, setIsModalVisible] = useState<string>("");
  const [rebootModalOpen, setRebootModalOpen] = useState(false);
  const [shutdownModalOpen, setShutdownModalOpen] = useState(false);

  const addedTags = instanceTags.filter((tag) => !instance.tags.includes(tag));

  const { securityProfiles, isSecurityProfilesLoading } =
    useTaggedSecurityProfiles(addedTags, [instance]);

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
  const { isFeatureEnabled } = useAuth();

  useEffect(() => {
    setInstanceTags([...instance.tags]);
  }, [instance.tags]);

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: editInstance, isPending: isEditing } = editInstanceQuery;
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

  const tagsChanged =
    instanceTags.length !== instance.tags.length ||
    instanceTags.some((tag) => !instance.tags.includes(tag)) ||
    instance.tags.some((tag) => !instanceTags.includes(tag));

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
            onClick: () => {
              openActivityDetails(activity);
            },
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

  const closeModal = () => {
    setIsModalVisible("");
  };

  const handleRemoveInstance = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      navigate("/instances", { replace: true });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
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
            onClick: () => {
              openActivityDetails(sanitizeActivity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const updateTags = async () => {
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
    } finally {
      closeModal();
    }
  };

  const handleTagsUpdate = async () => {
    if (securityProfiles.length) {
      setIsModalVisible("securityProfilesTags");
    } else {
      updateTags();
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
        <RunInstanceScriptForm
          parentAccessGroup={instance.access_group}
          query={`id:${instance.id}`}
        />
      </Suspense>,
    );
  };

  const handleAssociateEmployee = () => {
    setSidePanelContent(
      `Associate employee with ${instance.title}`,
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
          <ResponsiveButtons
            collapseFrom="xxl"
            buttons={[
              <Button
                key="edit-instance"
                type="button"
                onClick={handleEditInstance}
                hasIcon
              >
                <Icon name="edit" />
                <span>Edit</span>
              </Button>,
              currentInstanceCan("runScripts", instance) && (
                <Button
                  key="run-script"
                  type="button"
                  onClick={handleRunScript}
                  hasIcon
                >
                  <Icon name="code" />
                  <span>Run script</span>
                </Button>
              ),
              <Button
                key="remove-instance"
                hasIcon
                type="button"
                disabled={isRemoving}
                onClick={() => {
                  setIsModalVisible("remove");
                }}
                aria-label={`Remove ${instance.title} instance`}
              >
                <Icon name={ICONS.delete} />
                <span>Remove from Landscape</span>
              </Button>,
              <Button
                key="sanitize-instance"
                hasIcon
                type="button"
                disabled={isSanitizing}
                onClick={() => {
                  setIsModalVisible("sanitize");
                }}
                aria-label={`Sanitize ${instance.title} instance`}
              >
                <Icon name="tidy" />
                <span>Sanitize</span>
              </Button>,
              <Button
                key="reboot-instance"
                hasIcon
                type="button"
                disabled={isRemoving}
                onClick={() => {
                  setRebootModalOpen(true);
                }}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </Button>,
              isFeatureEnabled("employee-management") && (
                <Button
                  key="associate-employee"
                  type="button"
                  hasIcon
                  onClick={handleAssociateEmployee}
                >
                  <Icon name={ICONS.user} />
                  <span>Associate employee</span>
                </Button>
              ),
              <Button
                key="shutdown-instance"
                hasIcon
                type="button"
                disabled={isRemoving}
                onClick={() => {
                  setShutdownModalOpen(true);
                }}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </Button>,
            ]}
          />
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
              onTagsChange={(value) => {
                setInstanceTags(value);
              }}
              tags={instanceTags}
            />
          </Col>
          <Col size={2} className={classes.tagsButton}>
            <Button
              type="button"
              className="u-no-margin--bottom"
              onClick={handleTagsUpdate}
              disabled={isSecurityProfilesLoading || !tagsChanged}
            >
              Update
            </Button>
          </Col>
        </Row>
      </div>

      {isModalVisible === "securityProfilesTags" && (
        <TagsAddConfirmationModal
          instances={[instance]}
          securityProfiles={securityProfiles}
          tags={addedTags}
          onConfirm={updateTags}
          confirmButtonDisabled={isEditing}
          close={closeModal}
        />
      )}

      <TextConfirmationModal
        isOpen={isModalVisible === "remove"}
        title="Remove instance from Landscape"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveInstance}
        close={closeModal}
        confirmationText={`remove ${instance.title}`}
      >
        <p>
          Removing this {instance.title} will delete all associated data and
          free up one license slot for another computer to be registered.
        </p>
      </TextConfirmationModal>

      <TextConfirmationModal
        isOpen={isModalVisible === "sanitize"}
        confirmButtonLabel="Sanitize"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isSanitizing}
        confirmButtonLoading={isSanitizing}
        onConfirm={handleSanitizeInstance}
        close={closeModal}
        confirmationText={`sanitize ${instance.title}`}
        title="Sanitize instance"
      >
        <p>
          Sanitization will permanently delete the encryption keys for{" "}
          {instance.title}, making its data completely irrecoverable. This
          action cannot be undone. Please confirm your wish to proceed.
        </p>
      </TextConfirmationModal>

      {rebootModalOpen && (
        <ConfirmationModal
          close={() => {
            setRebootModalOpen(false);
          }}
          title="Restart instance"
          confirmButtonLabel="Restart"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRebooting}
          confirmButtonLoading={isRebooting}
          onConfirm={async () => handleFormSubmit("reboot")}
        >
          <Form onSubmit={async () => handleFormSubmit("reboot")} noValidate>
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
            <p>This will restart &quot;{instance.title}&quot; instance.</p>
          </Form>
        </ConfirmationModal>
      )}

      {shutdownModalOpen && (
        <ConfirmationModal
          close={() => {
            setShutdownModalOpen(false);
          }}
          title="Shut down instance"
          confirmButtonLabel="Shutdown"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isShuttingDown}
          confirmButtonLoading={isShuttingDown}
          onConfirm={async () => handleFormSubmit("shutdown")}
        >
          <Form onSubmit={async () => handleFormSubmit("shutdown")} noValidate>
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
            <p>This will shut down &quot;{instance.title}&quot; instance.</p>
          </Form>
        </ConfirmationModal>
      )}
    </>
  );
};

export default InfoPanel;
