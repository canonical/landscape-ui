import { useFormik } from "formik";
import { FC } from "react";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Modal,
} from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { Instance } from "@/types/Instance";
import { ACTIVITY_INFO, INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { ActivityConfirmationFormProps } from "./types";
import classes from "./ActivityConfirmation.module.scss";

interface ActivityConfirmationProps {
  action: "reboot" | "shutdown";
  instance: Instance;
  onClose: () => void;
}

const ActivityConfirmation: FC<ActivityConfirmationProps> = ({
  action,
  instance,
  onClose,
}) => {
  const debug = useDebug();
  const { rebootInstancesQuery, shutdownInstancesQuery } = useInstances();

  const { mutateAsync: rebootInstances } = rebootInstancesQuery;
  const { mutateAsync: shutdownInstances } = shutdownInstancesQuery;

  const handleSubmit = async (values: ActivityConfirmationFormProps) => {
    const valuesToSubmit = {
      computer_ids: [instance.id],
      deliver_after: values.deliverImmediately
        ? undefined
        : `${values.deliver_after}:00Z`,
    };

    try {
      if (action === "reboot") {
        await rebootInstances(valuesToSubmit);
      } else {
        await shutdownInstances(valuesToSubmit);
      }
    } catch (error) {
      debug(error);
    } finally {
      onClose();
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Modal
        title={ACTIVITY_INFO[action].title}
        close={onClose}
        buttonRow={
          <Button
            type="submit"
            appearance="negative"
            disabled={formik.isSubmitting}
          >
            {ACTIVITY_INFO[action].ctaLabel}
          </Button>
        }
      >
        <div className={classes.wrapper}>
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
              formik.touched.deliver_after && formik.errors.deliver_after
                ? formik.errors.deliver_after
                : undefined
            }
          />
          <p>{ACTIVITY_INFO[action].getDescription(instance.title)}</p>
        </div>
      </Modal>
    </Form>
  );
};

export default ActivityConfirmation;
