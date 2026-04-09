import {
  CheckboxInput,
  ConfirmationModal,
  Input,
} from "@canonical/react-components";

import type { FC } from "react";
import { useShutDownInstances } from "../../api";
import { getFormikError } from "@/utils/formikErrors";
import { useFormik } from "formik";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Instance } from "@/types/Instance";
import {
  REBOOT_OR_SHUT_DOWN_INITIAL_VALUES,
  REBOOT_OR_SHUT_DOWN_VALIDATION_SCHEMA,
} from "../../constants";
import { useActivities } from "@/features/activities";
import { pluralizeArray } from "@/utils/_helpers";

interface ShutDownModalProps {
  readonly close: () => void;
  readonly instances: Instance[];
}

const ShutDownModal: FC<ShutDownModalProps> = ({ instances, close }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { openActivityDetails } = useActivities();

  const { shutDownInstances, isShuttingDownInstances } = useShutDownInstances();

  const title = pluralizeArray(
    instances,
    (instance) => instance.title,
    "instances",
  );

  const formik = useFormik({
    initialValues: REBOOT_OR_SHUT_DOWN_INITIAL_VALUES,
    validationSchema: REBOOT_OR_SHUT_DOWN_VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      const valuesToSubmit = {
        computer_ids: instances.map(({ id }) => id),
        deliver_after: values.deliverImmediately
          ? undefined
          : `${values.deliver_after}:00Z`,
      };

      try {
        const { data: activity } = await shutDownInstances(valuesToSubmit);

        notify.success({
          title: `You queued ${title} to be shut down.`,
          message: `An activity is queued to shut down ${title}.`,
          actions: [
            {
              label: "View details",
              onClick: () => {
                openActivityDetails(activity);
              },
            },
          ],
        });

        close();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <>
      <ConfirmationModal
        close={close}
        title={`Shut down ${title}`}
        confirmButtonLabel="Shut down"
        confirmButtonLoading={isShuttingDownInstances}
        onConfirm={() => {
          formik.handleSubmit();
        }}
        renderInPortal
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
          placeholder="Scheduled time"
          {...formik.getFieldProps("deliver_after")}
          disabled={formik.values.deliverImmediately}
          error={getFormikError(formik, "deliver_after")}
        />
        <p>This will shut down {title}.</p>
      </ConfirmationModal>
    </>
  );
};

export default ShutDownModal;
