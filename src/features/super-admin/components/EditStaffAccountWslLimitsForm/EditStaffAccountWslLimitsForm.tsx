import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import { ConfirmationModal, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useState } from "react";
import { useEditStaffAccountWslLimits } from "../../api";
import { WSL_LIMIT_FIELDS } from "../../constants";
import type { StaffAccount, WslFeatureLimits } from "../../types";
import { VALIDATION_SCHEMA, WSL_LIMIT_MIN } from "./constants";
import { describeChanges, getFieldErrors, getLimits } from "./helpers";
import type { FormProps } from "./types";

interface EditStaffAccountWslLimitsFormProps {
  readonly staffAccount: StaffAccount;
  readonly wslLimits: WslFeatureLimits;
}

const EditStaffAccountWslLimitsForm: FC<EditStaffAccountWslLimitsFormProps> = ({
  staffAccount,
  wslLimits,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editWslLimits, isEditingWslLimits } = useEditStaffAccountWslLimits();

  // The limits waiting for confirmation.
  const [pendingLimits, setPendingLimits] = useState<WslFeatureLimits | null>(
    null,
  );

  const formik = useFormik<FormProps>({
    initialValues: wslLimits,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      const limits = getLimits(values);

      if (!limits) {
        return;
      }

      if (!describeChanges(limits, wslLimits).length) {
        closeSidePanel();
        return;
      }

      setPendingLimits(limits);
    },
  });

  const closeConfirmation = () => {
    setPendingLimits(null);
  };

  // The server replaces the whole set, so every limit is sent.
  const saveLimits = async (limits: WslFeatureLimits) => {
    try {
      await editWslLimits({ name: staffAccount.account, ...limits });

      closeSidePanel();

      notify.success({
        title: "WSL limits have been saved",
        message: `You changed the WSL limits of ${staffAccount.company}.`,
      });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);

      if (Object.keys(fieldErrors).length) {
        formik.setErrors(fieldErrors);
      } else {
        debug(error);
      }
    } finally {
      closeConfirmation();
    }
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit} noValidate>
        {WSL_LIMIT_FIELDS.map(({ name, label, defaultValue }) => (
          <Input
            key={name}
            type="number"
            label={label}
            help={`The default is ${defaultValue.toLocaleString("en")}.`}
            required
            min={WSL_LIMIT_MIN}
            {...formik.getFieldProps(name)}
            error={getFormikError(formik, name)}
          />
        ))}

        <SidePanelFormButtons
          submitButtonDisabled={isEditingWslLimits}
          submitButtonText="Save changes"
        />
      </Form>

      {pendingLimits && (
        <ConfirmationModal
          title={`Change the WSL limits of ${staffAccount.company}`}
          confirmButtonLabel="Save changes"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isEditingWslLimits}
          confirmButtonLoading={isEditingWslLimits}
          onConfirm={async () => saveLimits(pendingLimits)}
          close={closeConfirmation}
        >
          <p>
            This will change the WSL limits of{" "}
            <strong>{staffAccount.company}</strong> ({staffAccount.account}).
            The changes apply to the account immediately.
          </p>
          <ul className="u-margin--bottom">
            {describeChanges(pendingLimits, wslLimits).map(
              ({ label, from, to }) => (
                <li key={label}>
                  {label}: {from} → <strong>{to}</strong>
                </li>
              ),
            )}
          </ul>
        </ConfirmationModal>
      )}
    </>
  );
};

export default EditStaffAccountWslLimitsForm;
