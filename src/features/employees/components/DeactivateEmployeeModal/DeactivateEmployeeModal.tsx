import useNotify from "@/hooks/useNotify";
import {
  CheckboxInput,
  ConfirmationModal,
  Form,
  Icon,
  Input,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import {
  REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE,
  SANITIZATION_TOOLTIP_MESSAGE,
} from "../../constants";
import type { Employee } from "../../types";
import { INITIAL_VALUES } from "./constants";
import classes from "./DeactivateEmployeeModal.module.scss";
import {
  getDeactivationMessage,
  getDeactivationModalButtonTitle,
  getDeactivationModalTitle,
  isDisabledConfirmationButton,
} from "./helpers";
import { useDeactivateEmployee } from "../../api";

interface DeactivateEmployeeModalProps {
  readonly employee: Employee;
  readonly handleClose: () => void;
}

const DeactivateEmployeeModal: FC<DeactivateEmployeeModalProps> = ({
  employee,
  handleClose,
}) => {
  const { notify } = useNotify();

  const { deactivateEmployee, isPending } = useDeactivateEmployee();

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    enableReinitialize: true,
    onSubmit: async () => {
      await deactivateEmployee({
        id: employee.id,
        is_active: false,
        removeFromLandscape: formik.values.removeFromLandscape,
        sanitize: formik.values.sanitizeInstances,
      });

      formik.resetForm();
      handleClose();

      const { notificationMessage, notificationTitle } = getDeactivationMessage(
        employee.name,
        formik.values.sanitizeInstances,
        formik.values.removeFromLandscape,
      );

      notify.success({
        title: notificationTitle,
        message: notificationMessage,
      });

      // need multiple notification popups for this feature
      // notify.success({
      //   title: `You have successfully deactivated ${employee.name}`,
      //   message:
      //     "This employee won’t be able to log in to Landscape or register new instances with their account.",
      // });
      // if (formik.values.sanitizeInstances) {
      //   notify.success({
      //     title: `You have successfully initiated Sanitization for the ${employee.name}’s instances`,
      //     message: `Sanitizing for the ${employee.name}’s instances has been queued in Activities. The data will be permanently irrecoverable once complete.`,
      //   });
      // }
      // if (formik.values.removeFromLandscape) {
      //   notify.success({
      //     title: `You have successfully initiated the removal of the ${employee.name}’s instances`,
      //     message: `The removal of the ${employee.name}’s instances has been queued. This process will delete all its stored data. To manage it again, you will need to re-register it in Landscape.`,
      //   });
      // }
    },
  });

  return (
    <ConfirmationModal
      title={getDeactivationModalTitle(employee.name, formik.values)}
      confirmButtonLabel={getDeactivationModalButtonTitle(formik.values)}
      confirmButtonProps={{
        type: "submit",
      }}
      onConfirm={() => formik.handleSubmit()}
      close={handleClose}
      confirmButtonDisabled={
        isDisabledConfirmationButton(formik.values) || isPending
      }
      confirmButtonLoading={isPending}
    >
      <Form noValidate onSubmit={formik.handleSubmit}>
        <p>
          This will prevent {employee.name} from logging in to Landscape and
          from registering any new instances with their account
        </p>

        <b>Additional actions</b>
        <div>
          <CheckboxInput
            label={
              <span>
                <span className={classes.title}>
                  Sanitize associated instances
                </span>
                <Tooltip
                  position="top-center"
                  message={SANITIZATION_TOOLTIP_MESSAGE}
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            {...formik.getFieldProps("sanitizeInstances")}
            onChange={async (e) => {
              formik.getFieldProps("sanitizeInstances").onChange(e);
              await formik.setFieldValue("sanitizationConfirmationText", "");
            }}
          />
          {formik.values.sanitizeInstances && (
            <div className={classes.additionalActionContainer}>
              <p>
                Sanitization will permanently delete the encryption keys for
                associated instances, making its data completely irrecoverable.
                This action cannot be undone. Please confirm you wish to
                proceed.
              </p>
              <Input
                key="sanitizationConfirmationText"
                label={
                  <span>
                    Type <b>sanitize instances</b> to confirm
                  </span>
                }
                aria-label="Sanitization confirmation text"
                type="text"
                {...formik.getFieldProps("sanitizationConfirmationText")}
              />
            </div>
          )}

          <CheckboxInput
            label={
              <span>
                <span className={classes.title}>
                  Remove associated instances from Landscape
                </span>
                <Tooltip
                  position="top-center"
                  message={REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE}
                  positionElementClassName={classes.tooltipPositionElement}
                >
                  <Icon name="help" aria-hidden />
                  <span className="u-off-screen">Help</span>
                </Tooltip>
              </span>
            }
            {...formik.getFieldProps("removeFromLandscape")}
            onChange={async (e) => {
              formik.getFieldProps("removeFromLandscape").onChange(e);
              await formik.setFieldValue(
                "removeFromLandscapeConfirmationText",
                "",
              );
            }}
          />

          {formik.values.removeFromLandscape && (
            <div className={classes.additionalActionContainer}>
              <p>
                This will remove all associated instances from Landscape, along
                with their stored data. To manage them again, you would need to
                re-register them in Landscape.
              </p>
              <Input
                key="removeFromLandscapeConfirmationText"
                label={
                  <span>
                    Type <b>remove instances</b> to confirm.
                  </span>
                }
                aria-label="Remove from Landscape confirmation text"
                type="text"
                {...formik.getFieldProps("removeFromLandscapeConfirmationText")}
              />
            </div>
          )}
        </div>
      </Form>
    </ConfirmationModal>
  );
};

export default DeactivateEmployeeModal;
