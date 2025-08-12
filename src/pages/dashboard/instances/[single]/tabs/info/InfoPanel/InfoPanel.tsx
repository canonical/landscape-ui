import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import Chip from "@/components/layout/Chip";
import HeaderActions from "@/components/layout/HeaderActions";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import {
  useDisassociateEmployeeFromInstance,
  useGetEmployee,
} from "@/features/employees";
import {
  getFeatures,
  getStatusCellIconAndLabel,
  InstanceRemoveFromLandscapeModal,
  useRestartInstances,
  useSanitizeInstance,
  useShutDownInstances,
} from "@/features/instances";
import {
  WslInstanceReinstallModal,
  WslInstanceUninstallModal,
} from "@/features/wsl";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type {
  Instance,
  InstanceChild,
  WindowsInstance,
  WslInstance,
} from "@/types/Instance";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  ConfirmationModal,
  Form,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { useBoolean } from "usehooks-ts";
import Profiles from "./components/Profiles";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./InfoPanel.module.scss";
import type { ModalConfirmationFormProps } from "./types";

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
  const { isFeatureEnabled } = useAuth();
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { openActivityDetails } = useActivities();
  const { employee, isGettingEmployee } = useGetEmployee(
    { id: instance.employee_id ?? 0 },
    { enabled: !!instance.employee_id },
  );
  const { restartInstances, isRestartingInstances } = useRestartInstances();
  const { getAccessGroupQuery } = useRoles();
  const { sanitizeInstance, isSanitizingInstance } = useSanitizeInstance();
  const { shutDownInstances, isShuttingDownInstances } = useShutDownInstances();
  const { disassociateEmployeeFromInstance, isDisassociating } =
    useDisassociateEmployeeFromInstance();

  const {
    value: isRestartModalOpen,
    setTrue: openRestartModal,
    setFalse: closeRestartModal,
  } = useBoolean();

  const {
    value: isShutDownModalOpen,
    setTrue: openShutDownModal,
    setFalse: closeShutDownModal,
  } = useBoolean();

  const {
    value: isReinstallModalOpen,
    setTrue: openReinstallModal,
    setFalse: closeReinstallModal,
  } = useBoolean();

  const {
    value: isUninstallModalOpen,
    setTrue: openUninstallModal,
    setFalse: closeUninstallModal,
  } = useBoolean();

  const {
    value: isRemoveFromLandscapeModalOpen,
    setTrue: openRemoveFromLandscapeModal,
    setFalse: closeRemoveFromLandscapeModal,
  } = useBoolean();

  const {
    value: isSanitizeModalOpen,
    setTrue: openSanitizeModal,
    setFalse: closeSanitizeModal,
  } = useBoolean();

  const {
    value: disassociateModalOpen,
    setTrue: openDisassociateModal,
    setFalse: closeDisassociateModal,
  } = useBoolean();

  const { data: getAccessGroupQueryResult, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();

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
          ? await restartInstances(valuesToSubmit)
          : await shutDownInstances(valuesToSubmit);

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

  if (isGettingAccessGroups || isGettingEmployee) {
    return <LoadingState />;
  }

  const handleSanitizeInstance = async () => {
    try {
      const { data: sanitizeActivity } = await sanitizeInstance({
        computer_id: instance.id,
        computer_title: instance.title,
      });

      notify.success({
        title: `You have successfully marked ${instance.title} to be sanitized.`,
        message: `An activity has been queued to sanitize it. The data will be permanently irrecoverable once complete.`,
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
      closeSanitizeModal();
    }
  };

  const openEditForm = () => {
    setSidePanelContent(
      "Edit instance",
      <Suspense fallback={<LoadingState />}>
        <EditInstance instance={instance} />
      </Suspense>,
    );
  };

  const openRunScriptForm = () => {
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

  const openAssociateEmployeeForm = () => {
    setSidePanelContent(
      `Associate employee with ${instance.title}`,
      <Suspense fallback={<LoadingState />}>
        <AssignEmployeeToInstanceForm instanceTitle={instance.title} />
      </Suspense>,
    );
  };

  const handleDisassociateEmployee = async () => {
    try {
      await disassociateEmployeeFromInstance({
        computer_id: instance.id,
        employee_id: instance.employee_id ?? 0,
      });

      closeDisassociateModal();

      notify.success({
        title: `You have successfully disassociated ${employee?.name ?? "the employee"}.`,
        message: `${employee?.name ?? "The employee"} has been successfully disassociated from ${instance.title}.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleFormSubmit = async (action: "reboot" | "shutdown") => {
    await formik.setFieldValue("action", action);
    formik.handleSubmit();
  };

  const goBack = () => {
    navigate("/instances", { replace: true });
  };

  const accessGroups = getAccessGroupQueryResult
    ? getAccessGroupQueryResult.data
    : [];

  return (
    <>
      <HeaderActions
        key={instance.employee_id ?? "no-employee"}
        title={
          <div className={classes.headerContainer}>
            <h2
              className={classNames(
                "p-heading--4 u-no-padding--top",
                classes.heading,
              )}
            >
              {instance.title}
            </h2>

            {instance.is_wsl_instance && <Chip value="WSL instance" />}
          </div>
        }
        actions={{
          nondestructive: [
            { icon: "edit", label: "Edit", onClick: openEditForm },
            {
              icon: "restart",
              label: "Restart",
              onClick: openRestartModal,
              excluded: !getFeatures(instance).power,
            },
            {
              icon: "power-off",
              label: "Shut down",
              onClick: openShutDownModal,
              excluded: !getFeatures(instance).power,
            },
            {
              icon: "code",
              label: "Run script",
              onClick: openRunScriptForm,
              excluded: !getFeatures(instance).scripts,
            },
            {
              icon: ICONS.user,
              label: "Associate employee",
              onClick: openAssociateEmployeeForm,
              collapsed: true,
              excluded:
                !isFeatureEnabled("employee-management") ||
                !getFeatures(instance).employees ||
                instance.employee_id !== null,
            },
            {
              icon: ICONS.user,
              label: "Disassociate employee",
              onClick: openDisassociateModal,
              collapsed: true,
              excluded:
                !isFeatureEnabled("employee-management") ||
                !getFeatures(instance).employees ||
                instance.employee_id === null,
            },
          ],
          destructive: [
            {
              icon: "restart",
              label: "Reinstall",
              onClick: openReinstallModal,
              collapsed: true,
              excluded: !getFeatures(instance).uninstallation,
            },
            {
              icon: "close",
              label: "Uninstall",
              onClick: openUninstallModal,
              collapsed: true,
              excluded: !getFeatures(instance).uninstallation,
            },
            {
              icon: ICONS.delete,
              label: "Remove from Landscape",
              onClick: openRemoveFromLandscapeModal,
              collapsed: true,
            },
            {
              icon: "tidy",
              label: "Sanitize",
              onClick: openSanitizeModal,
              collapsed: true,
              excluded: !getFeatures(instance).sanitization,
            },
          ],
        }}
      />

      <Blocks>
        <Blocks.Item title="Status">
          <InfoGrid>
            <InfoGrid.Item
              label="Status"
              value={
                <div className={classes.status}>
                  <Icon name={getStatusCellIconAndLabel(instance).icon ?? ""} />
                  <span>{getStatusCellIconAndLabel(instance).label}</span>
                </div>
              }
            />
            <InfoGrid.Item
              label="Last ping time"
              value={
                moment(instance.last_ping_time).isValid()
                  ? moment(instance.last_ping_time).format(
                      DISPLAY_DATE_TIME_FORMAT,
                    )
                  : null
              }
            />
            <InfoGrid.Item
              label="Access group"
              value={
                accessGroups.find(
                  (accessGroup) => accessGroup.name === instance.access_group,
                )?.title || instance.access_group
              }
            />
            <InfoGrid.Item
              label="Tags"
              value={instance.tags.join(", ") || null}
              type="truncated"
            />
            <InfoGrid.Item
              label="Profiles"
              value={
                instance.profiles?.length ? (
                  <Profiles profiles={instance.profiles} />
                ) : null
              }
              type="truncated"
            />
            {getFeatures(instance).employees && (
              <InfoGrid.Item
                label="Associated employee"
                value={employee?.name}
              />
            )}
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Registration details">
          <InfoGrid>
            <InfoGrid.Item label="Hostname" value={instance.hostname} />
            <InfoGrid.Item label="ID" value={instance.id} />
            {getFeatures(instance).hardware && (
              <InfoGrid.Item
                label="Serial number"
                value={instance.grouped_hardware?.system.serial}
              />
            )}
            {getFeatures(instance).hardware && (
              <InfoGrid.Item
                label="Product identifier"
                value={instance.grouped_hardware?.system.model}
              />
            )}
            <InfoGrid.Item
              label="OS"
              value={instance.distribution_info?.description}
            />
            {getFeatures(instance).hardware && (
              <InfoGrid.Item
                label="IP addresses"
                value={
                  Array.isArray(instance.grouped_hardware?.network)
                    ? instance.grouped_hardware.network
                        .map((network) => network.ip)
                        .join(", ")
                    : null
                }
                type="truncated"
              />
            )}
            <InfoGrid.Item
              label="Registered"
              value={moment(instance.registered_at).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Other">
          <InfoGrid>
            <InfoGrid.Item label="Annotations" value={null} />
            <InfoGrid.Item label="Comment" value={instance.comment || null} />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>

      {isRestartModalOpen && (
        <ConfirmationModal
          close={closeRestartModal}
          title="Restart instance"
          confirmButtonLabel="Restart"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isRestartingInstances}
          confirmButtonLoading={isRestartingInstances}
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
              placeholder="Scheduled time"
              {...formik.getFieldProps("deliver_after")}
              disabled={formik.values.deliverImmediately}
              error={getFormikError(formik, "deliver_after")}
            />
            <p>This will restart &quot;{instance.title}&quot; instance.</p>
          </Form>
        </ConfirmationModal>
      )}

      {isShutDownModalOpen && (
        <ConfirmationModal
          close={closeShutDownModal}
          title="Shut down instance"
          confirmButtonLabel="Shut down"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isShuttingDownInstances}
          confirmButtonLoading={isShuttingDownInstances}
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
              placeholder="Scheduled time"
              {...formik.getFieldProps("deliver_after")}
              disabled={formik.values.deliverImmediately}
              error={getFormikError(formik, "deliver_after")}
            />
            <p>This will shut down &quot;{instance.title}&quot; instance.</p>
          </Form>
        </ConfirmationModal>
      )}

      {disassociateModalOpen && (
        <ConfirmationModal
          close={closeDisassociateModal}
          title={`Disassociate employee from ${instance.title}`}
          confirmButtonLabel="Disassociate"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isDisassociating}
          confirmButtonLoading={isDisassociating}
          onConfirm={handleDisassociateEmployee}
        >
          <p>
            You are about to disassociate instance {instance.title} from{" "}
            {employee?.name}. This will revoke their access to the instance’s
            details and recovery key.
          </p>
        </ConfirmationModal>
      )}

      {instance.is_wsl_instance && (
        <>
          <WslInstanceReinstallModal
            close={closeReinstallModal}
            instances={[
              {
                name: instance.title,
                computer_id: instance.id,
              } as InstanceChild,
            ]}
            isOpen={isReinstallModalOpen}
            windowsInstance={instance as WindowsInstance}
          />

          <WslInstanceUninstallModal
            close={closeUninstallModal}
            instances={[
              {
                name: instance.title,
                computer_id: instance.id,
              } as InstanceChild,
            ]}
            isOpen={isUninstallModalOpen}
            onSuccess={goBack}
            parentId={(instance as WslInstance).parent.id}
          />
        </>
      )}

      <InstanceRemoveFromLandscapeModal
        close={closeRemoveFromLandscapeModal}
        instance={instance}
        isOpen={isRemoveFromLandscapeModalOpen}
        onSuccess={goBack}
      />

      <TextConfirmationModal
        isOpen={isSanitizeModalOpen}
        confirmButtonLabel="Sanitize"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isSanitizingInstance}
        confirmButtonLoading={isSanitizingInstance}
        onConfirm={handleSanitizeInstance}
        close={closeSanitizeModal}
        confirmationText={`sanitize ${instance.title}`}
        title="Sanitize instance"
      >
        <p>
          Sanitization will permanently delete the encryption keys for{" "}
          {instance.title}, making its data completely irrecoverable. This
          action cannot be undone. Please confirm your wish to proceed.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default InfoPanel;
