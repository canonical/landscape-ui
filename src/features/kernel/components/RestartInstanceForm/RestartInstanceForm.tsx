import { useActivities } from "@/features/activities";
import { useRestartInstance } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import {
  Button,
  ConfirmationButton,
  Form,
  Notification,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import { useKernel } from "../../hooks";
import { UPGRADE_MESSAGE_WITH_REBOOT } from "../UpgradeKernelForm/constants";
import {
  INITIAL_VALUES,
  NOTIFICATION_MESSAGE,
  VALIDATION_SCHEMA,
} from "./constants";
import type { FormProps } from "./types";
import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";

interface RestartInstanceFormProps {
  readonly showNotification: boolean;
  readonly instanceName: string;
  readonly newKernelVersionId?: number;
}

const RestartInstanceForm: FC<RestartInstanceFormProps> = ({
  showNotification,
  instanceName,
  newKernelVersionId,
}) => {
  const debug = useDebug();
  const { instanceId } = useParams<UrlParams>();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const { upgradeKernelQuery } = useKernel();
  const { openActivityDetails } = useActivities();

  const { restartInstance, isRestartingInstance } = useRestartInstance();
  const { mutateAsync: upgradeKernel, isPending: isUpgradingAndRestarting } =
    upgradeKernelQuery;

  const handleUpgradeAndRestartSubmit = async () => {
    const { data: activity } = await upgradeKernel({
      id: Number(instanceId),
      kernel_package_id: Number(newKernelVersionId),
      reboot_after: true,
    });

    closeSidePanel();

    notify.success({
      title: `You queued kernel upgrade for "${instanceName}"`,
      message: UPGRADE_MESSAGE_WITH_REBOOT,
      actions: [
        {
          label: "View details",
          onClick: () => {
            openActivityDetails(activity);
          },
        },
      ],
    });
  };

  const handleRestartSubmit = async (values: FormProps) => {
    const { data: activity } = await restartInstance({
      id: Number(instanceId),
      deliver_after: values.deliver_after,
      deliver_delay_window: values.deliver_delay_window,
    });

    closeSidePanel();

    notify.success({
      title: `You queued "${instanceName}" to be restarted.`,
      message: `Instance "${instanceName}" will be restarted and is queued in Activities`,
      actions: [
        {
          label: "View details",
          onClick: () => {
            openActivityDetails(activity);
          },
        },
      ],
    });
  };

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        if (values.upgrade_and_restart) {
          await handleUpgradeAndRestartSubmit();
        } else {
          await handleRestartSubmit(values);
        }
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleUpgradeAndRestart = async () => {
    await formik.setFieldValue("upgrade_and_restart", true);
    formik.handleSubmit();
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {showNotification && (
        <Notification title="Restart recommended" severity="caution">
          {NOTIFICATION_MESSAGE}
        </Notification>
      )}

      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />

      <div className="form-buttons">
        <Button type="button" appearance="base" onClick={closeSidePanel}>
          Cancel
        </Button>
        {showNotification && newKernelVersionId && (
          <ConfirmationButton
            type="button"
            confirmationModalProps={{
              title: "Upgrading kernel and restarting instance",
              children: (
                <p>
                  Are you sure? This action will upgrade the kernel and restart
                  the instance.
                </p>
              ),
              confirmButtonLabel: "Upgrade and Restart",
              confirmButtonAppearance: "negative",
              confirmButtonLoading: isUpgradingAndRestarting,
              confirmButtonDisabled: isUpgradingAndRestarting,
              onConfirm: handleUpgradeAndRestart,
            }}
          >
            Upgrade and Restart
          </ConfirmationButton>
        )}
        <ConfirmationButton
          type="button"
          appearance="negative"
          confirmationModalProps={{
            title: "Restarting instance",
            children: (
              <p>Are you sure? This action will restart the instance.</p>
            ),
            confirmButtonLabel: "Restart",
            confirmButtonAppearance: "negative",
            confirmButtonLoading: isRestartingInstance,
            confirmButtonDisabled: isRestartingInstance,
            onConfirm: () => {
              formik.handleSubmit();
            },
          }}
        >
          Restart
        </ConfirmationButton>
      </div>
    </Form>
  );
};

export default RestartInstanceForm;
