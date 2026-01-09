import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";
import InfoGrid from "@/components/layout/InfoGrid";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import type { UrlParams } from "@/types/UrlParams";
import { hasOneItem } from "@/utils/_helpers";
import {
  Button,
  ConfirmationButton,
  Form,
  Notification,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import { KERNEL_ACTIONS_VALIDATION_SCHEMA } from "../../constants";
import { useKernel } from "../../hooks";
import type { Kernel } from "../../types";
import {
  NOTIFICATION_MESSAGE,
  UPGRADE_MESSAGE_WITH_REBOOT,
  UPGRADE_MESSAGE_WITHOUT_REBOOT,
} from "./constants";
import type { FormProps } from "./types";

interface UpgradeKernelFormProps {
  readonly currentKernelVersion: string;
  readonly upgradeKernelVersions: Kernel[];
  readonly instanceName: string;
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
    new_kernel_version_id: hasOneItem(upgradeKernelVersions)
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
          deliver_after: values.deliver_immediately
            ? undefined
            : values.deliver_after,
          deliver_delay_window: values.randomize_delivery
            ? values.deliver_delay_window
            : undefined,
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
              onClick: () => {
                openActivityDetails(activity);
              },
            },
          ],
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleRebootAndSubmit = async () => {
    await formik.setFieldValue("reboot_after", true);
    formik.handleSubmit();
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Notification severity="information" title="Restart recommended">
        <span>{NOTIFICATION_MESSAGE}</span>
      </Notification>
      <InfoGrid spaced>
        <InfoGrid.Item label="Current version" value={currentKernelVersion} />
        <InfoGrid.Item
          label="New version"
          value={
            hasOneItem(upgradeKernelVersions) ? (
              <span>{upgradeKernelVersions[0].version_rounded}</span>
            ) : (
              <Select
                options={KERNEL_VERSION_OPTIONS}
                {...formik.getFieldProps("new_kernel_version")}
              />
            )
          }
        />
      </InfoGrid>

      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />

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
            onConfirm: () => {
              formik.handleSubmit();
            },
          }}
        >
          Upgrade kernel
        </ConfirmationButton>
      </div>
    </Form>
  );
};

export default UpgradeKernelForm;
