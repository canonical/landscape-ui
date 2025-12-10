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
  DOWNGRADE_MESSAGE_WITH_REBOOT,
  DOWNGRADE_MESSAGE_WITHOUT_REBOOT,
  SECURITY_WARNING,
} from "./constants";
import type { FormProps } from "./types";

interface DowngradeKernelFormProps {
  readonly currentKernelVersion: string;
  readonly downgradeKernelVersions: Kernel[];
  readonly instanceName: string;
}

const DowngradeKernelForm: FC<DowngradeKernelFormProps> = ({
  currentKernelVersion,
  downgradeKernelVersions,
  instanceName,
}) => {
  const debug = useDebug();
  const { instanceId } = useParams<UrlParams>();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const { downgradeKernelQuery } = useKernel();
  const { openActivityDetails } = useActivities();

  const { mutateAsync: downgradeKernel, isPending: isDowngradingKernel } =
    downgradeKernelQuery;

  const KERNEL_VERSION_OPTIONS: SelectOption[] = [
    {
      label: "Select",
      value: "",
    },
    ...downgradeKernelVersions.map((kernel) => ({
      label: kernel.version_rounded,
      value: kernel.id.toString(),
    })),
  ];

  const initialValues: FormProps = {
    deliver_immediately: true,
    randomize_delivery: false,
    deliver_delay_window: 0,
    deliver_after: "",
    new_kernel_version_id: hasOneItem(downgradeKernelVersions)
      ? downgradeKernelVersions[0].id.toString()
      : "",
    reboot_after: false,
  };

  const formik = useFormik<FormProps>({
    initialValues: initialValues,
    validationSchema: KERNEL_ACTIONS_VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        const { data: activity } = await downgradeKernel({
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

        const downgradeNotificationMessage = values.reboot_after
          ? DOWNGRADE_MESSAGE_WITH_REBOOT
          : DOWNGRADE_MESSAGE_WITHOUT_REBOOT;

        notify.success({
          title: `You queued kernel downgrade for instance "${instanceName}"`,
          message: downgradeNotificationMessage,
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
      <Notification severity="caution" title="Security warning">
        <span>{SECURITY_WARNING}</span>
      </Notification>
      <InfoGrid spaced>
        <InfoGrid.Item label="Current version" value={currentKernelVersion} />
        <InfoGrid.Item
          label="Kernel version"
          value={
            hasOneItem(downgradeKernelVersions) ? (
              <span>{downgradeKernelVersions[0].version_rounded}</span>
            ) : (
              <Select
                options={KERNEL_VERSION_OPTIONS}
                {...formik.getFieldProps("new_kernel_version_id")}
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
            title: "Downgrading kernel and restarting instance",
            children: (
              <p>
                Are you sure? This action will downgrade the kernel and restart
                the instance.
              </p>
            ),
            confirmButtonLabel: "Downgrade and Restart",
            confirmButtonAppearance: "negative",
            confirmButtonLoading: isDowngradingKernel,
            confirmButtonDisabled: isDowngradingKernel,
            onConfirm: handleRebootAndSubmit,
          }}
        >
          Downgrade and Restart
        </ConfirmationButton>
        <ConfirmationButton
          type="button"
          appearance="negative"
          confirmationModalProps={{
            title: "Downgrading kernel",
            children: (
              <p>Are you sure? This action will downgrade the kernel.</p>
            ),
            confirmButtonLabel: "Downgrade",
            confirmButtonAppearance: "negative",
            confirmButtonLoading: isDowngradingKernel,
            confirmButtonDisabled: isDowngradingKernel,
            onConfirm: () => {
              formik.handleSubmit();
            },
          }}
        >
          Downgrade kernel
        </ConfirmationButton>
      </div>
    </Form>
  );
};

export default DowngradeKernelForm;
