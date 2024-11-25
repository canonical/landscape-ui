import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  ConfirmationButton,
  Form,
  Input,
  Notification,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { FC } from "react";
import { useParams } from "react-router-dom";
import {
  INITIAL_VALUES,
  NOTIFICATION_MESSAGE,
  VALIDATION_SCHEMA,
} from "./constants";
import classes from "./RestartInstanceForm.module.scss";
import { FormProps } from "./types";
import { useKernel } from "../../hooks";
import { UPGRADE_MESSAGE_WITH_REBOOT } from "../UpgradeKernelForm/constants";
import { UrlParams } from "@/types/UrlParams";

interface RestartInstanceFormProps {
  showNotification: boolean;
  instanceName: string;
  newKernelVersionId?: number;
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
  const { restartInstanceQuery } = useInstances();
  const { upgradeKernelQuery } = useKernel();
  const { openActivityDetails } = useActivities();

  const { mutateAsync: restartInstance, isPending: isRestartingInstance } =
    restartInstanceQuery;
  const { mutateAsync: upgradeKernel, isPending: isUpgradingAndRestarting } =
    upgradeKernelQuery;

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

  const handleDeliveryTimeChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const deliverImmediately = event.currentTarget.value === "true";
    await formik.setFieldValue("deliver_immediately", deliverImmediately);
    if (!deliverImmediately) {
      await formik.setFieldValue(
        "deliver_after",
        moment().toISOString().slice(0, 16),
      );
    }
  };

  const handleUpgradeAndRestart = async () => {
    await formik.setFieldValue("upgrade_and_restart", true);
    formik.handleSubmit();
  };

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
          onClick: () => openActivityDetails(activity),
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
          onClick: () => openActivityDetails(activity),
        },
      ],
    });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      {showNotification && (
        <Notification title="Restart recommended" severity="caution">
          {NOTIFICATION_MESSAGE}
        </Notification>
      )}

      <strong>Delivery time</strong>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="As soon as possible"
          name="deliver_immediately"
          value="true"
          onChange={handleDeliveryTimeChange}
          checked={formik.values.deliver_immediately}
        />
        <Input
          type="radio"
          label="Scheduled"
          name="deliver_immediately"
          value="false"
          onChange={handleDeliveryTimeChange}
          checked={!formik.values.deliver_immediately}
        />
      </div>
      {!formik.values.deliver_immediately && (
        <Input
          type="datetime-local"
          label="Deliver after"
          labelClassName="u-off-screen"
          {...formik.getFieldProps("deliver_after")}
          error={
            formik.touched.deliver_after && formik.errors.deliver_after
              ? formik.errors.deliver_after
              : undefined
          }
        />
      )}
      <strong className={classNames(classes.marginTop)}>
        Randomise delivery over a time window
      </strong>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="No"
          {...formik.getFieldProps("randomize_delivery")}
          onChange={async () => {
            await formik.setFieldValue("randomize_delivery", false);
            await formik.setFieldValue("deliver_delay_window", 0);
          }}
          checked={!formik.values.randomize_delivery}
        />
        <Input
          type="radio"
          label="Yes"
          {...formik.getFieldProps("randomize_delivery")}
          onChange={async () =>
            await formik.setFieldValue("randomize_delivery", true)
          }
          checked={formik.values.randomize_delivery}
        />
      </div>
      {formik.values.randomize_delivery && (
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          label="Delivery delay window"
          labelClassName="u-off-screen"
          help="Time in minutes"
          {...formik.getFieldProps("deliver_delay_window")}
          error={
            formik.touched.deliver_delay_window &&
            formik.errors.deliver_delay_window
              ? formik.errors.deliver_delay_window
              : undefined
          }
        />
      )}
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
            onConfirm: () => formik.handleSubmit(),
          }}
        >
          Restart
        </ConfirmationButton>
      </div>
    </Form>
  );
};

export default RestartInstanceForm;
