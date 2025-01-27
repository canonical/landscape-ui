import InfoItem from "@/components/layout/InfoItem";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import {
  Button,
  Col,
  ConfirmationButton,
  Form,
  Input,
  Notification,
  Row,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import { FC } from "react";
import { useParams } from "react-router";
import { useKernel } from "../../hooks";
import { Kernel } from "../../types";
import {
  NOTIFICATION_MESSAGE,
  UPGRADE_MESSAGE_WITH_REBOOT,
  UPGRADE_MESSAGE_WITHOUT_REBOOT,
} from "./constants";
import { FormProps } from "./types";
import classes from "./UpgradeKernelForm.module.scss";
import { UrlParams } from "@/types/UrlParams";
import { KERNEL_ACTIONS_VALIDATION_SCHEMA } from "../../constants";

interface UpgradeKernelFormProps {
  currentKernelVersion: string;
  upgradeKernelVersions: Kernel[];
  instanceName: string;
}

const UpgradeKernelForm: FC<UpgradeKernelFormProps> = ({
  currentKernelVersion,
  upgradeKernelVersions,
  instanceName,
}) => {
  const debug = useDebug();
  const { instanceId } = useParams<UrlParams>();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const { upgradeKernelQuery } = useKernel();
  const { openActivityDetails } = useActivities();

  const { mutateAsync: upgradeKernel, isPending: isUpgradingKernel } =
    upgradeKernelQuery;

  const KERNEL_VERSION_OPTIONS: SelectOption[] = [
    {
      label: "Select",
      value: "",
    },
    ...upgradeKernelVersions.map((kernel) => ({
      label: kernel.version_rounded,
      value: kernel.id.toString(),
    })),
  ];

  const initialValues: FormProps = {
    deliver_immediately: true,
    randomize_delivery: false,
    deliver_delay_window: 0,
    deliver_after: "",
    new_kernel_version_id:
      upgradeKernelVersions.length === 1
        ? upgradeKernelVersions[0].id.toString()
        : "",
    reboot_after: false,
  };

  const formik = useFormik<FormProps>({
    initialValues: initialValues,
    validationSchema: KERNEL_ACTIONS_VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        const { data: activity } = await upgradeKernel({
          id: Number(instanceId),
          kernel_package_id: Number(values.new_kernel_version_id),
          reboot_after: values.reboot_after,
        });

        closeSidePanel();

        const upgradeNotificationMessage = values.reboot_after
          ? UPGRADE_MESSAGE_WITH_REBOOT
          : UPGRADE_MESSAGE_WITHOUT_REBOOT;

        notify.success({
          title: `You queued kernel upgrade for "${instanceName}"`,
          message: upgradeNotificationMessage,
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

  const handleRebootAndSubmit = async () => {
    await formik.setFieldValue("reboot_after", true);
    formik.handleSubmit();
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Notification severity="information" title="Restart recommended">
        <span>{NOTIFICATION_MESSAGE}</span>
      </Notification>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="current version" value={currentKernelVersion} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="new version"
            value={
              upgradeKernelVersions.length === 1 ? (
                <span>{upgradeKernelVersions[0].version_rounded}</span>
              ) : (
                <Select
                  options={KERNEL_VERSION_OPTIONS}
                  {...formik.getFieldProps("new_kernel_version")}
                />
              )
            }
          />
        </Col>
      </Row>
      <strong className={classes.marginTop}>Delivery time</strong>
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
      <strong className={classes.marginTop}>
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
            confirmButtonAppearance: "positive",
            confirmButtonLoading: isUpgradingKernel,
            confirmButtonDisabled: isUpgradingKernel,
            onConfirm: handleRebootAndSubmit,
          }}
        >
          Upgrade and Restart
        </ConfirmationButton>
        <ConfirmationButton
          type="button"
          appearance="positive"
          confirmationModalProps={{
            title: "Upgrading kernel",
            children: <p>Are you sure? This action will upgrade the kernel.</p>,
            confirmButtonLabel: "Upgrade",
            confirmButtonAppearance: "positive",
            confirmButtonLoading: isUpgradingKernel,
            confirmButtonDisabled: isUpgradingKernel,
            type: "submit",
            onConfirm: () => formik.handleSubmit(),
          }}
        >
          Upgrade kernel
        </ConfirmationButton>
      </div>
    </Form>
  );
};

export default UpgradeKernelForm;
