import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  ConfirmationModal,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useState } from "react";
import { useEditStaffAccount } from "../../api";
import { SIZE_UNITS } from "@/utils/size";
import type { StaffAccount } from "../../types";
import {
  MAX_PEOPLE_COUNT_MAX,
  MAX_PEOPLE_COUNT_MIN,
  VALIDATION_SCHEMA,
} from "./constants";
import {
  describeChanges,
  getChanges,
  getFieldErrors,
  getInitialValues,
} from "./helpers";
import type { FormProps, StaffAccountChanges } from "./types";
import classes from "./EditStaffAccountForm.module.scss";

interface EditStaffAccountFormProps {
  readonly staffAccount: StaffAccount;
}

const EditStaffAccountForm: FC<EditStaffAccountFormProps> = ({
  staffAccount,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editStaffAccount, isEditingStaffAccount } = useEditStaffAccount();

  // The changes waiting for confirmation.
  const [pendingChanges, setPendingChanges] =
    useState<StaffAccountChanges | null>(null);

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues(staffAccount),
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      const changes = getChanges(values, staffAccount);

      if (!Object.keys(changes).length) {
        closeSidePanel();
        return;
      }

      setPendingChanges(changes);
    },
  });

  const closeConfirmation = () => {
    setPendingChanges(null);
  };

  const saveChanges = async (changes: StaffAccountChanges) => {
    try {
      await editStaffAccount({ name: staffAccount.account, ...changes });

      closeSidePanel();

      notify.success({
        title: "Account changes have been saved",
        message: `You modified the account ${staffAccount.company}.`,
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
        <Input
          type="text"
          label="Subdomain"
          help="Leave empty to remove the subdomain."
          autoComplete="off"
          {...formik.getFieldProps("subdomain")}
          error={getFormikError(formik, "subdomain")}
        />

        <Input
          type="text"
          label="Salesforce account key"
          help="Leave empty to remove the key."
          autoComplete="off"
          {...formik.getFieldProps("salesforce_account_key")}
          error={getFormikError(formik, "salesforce_account_key")}
        />

        <Input
          type="number"
          label="Administrator limit"
          help={`How many administrators the account can have, from ${MAX_PEOPLE_COUNT_MIN} to ${MAX_PEOPLE_COUNT_MAX}.`}
          required
          min={MAX_PEOPLE_COUNT_MIN}
          max={MAX_PEOPLE_COUNT_MAX}
          {...formik.getFieldProps("max_people_count")}
          error={getFormikError(formik, "max_people_count")}
        />

        <div className={classes.sizeField}>
          <Input
            type="number"
            label="Attachment size limit"
            help="The largest script attachment the account can upload. 1 MB is 1,048,576 bytes."
            required
            min={0}
            step="any"
            wrapperClassName={classes.sizeValue}
            {...formik.getFieldProps("max_attachment_size")}
            error={getFormikError(formik, "max_attachment_size")}
          />
          <Select
            label="Unit"
            aria-label="Attachment size unit"
            options={SIZE_UNITS.map(({ value, label }) => ({ value, label }))}
            {...formik.getFieldProps("max_attachment_size_unit")}
          />
        </div>

        <SidePanelFormButtons
          submitButtonDisabled={isEditingStaffAccount}
          submitButtonText="Save changes"
        />
      </Form>

      {pendingChanges && (
        <ConfirmationModal
          title={`Change ${staffAccount.company}`}
          confirmButtonLabel="Save changes"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isEditingStaffAccount}
          confirmButtonLoading={isEditingStaffAccount}
          onConfirm={async () => saveChanges(pendingChanges)}
          close={closeConfirmation}
        >
          <p>
            This will change <strong>{staffAccount.company}</strong> (
            {staffAccount.account}). The changes apply to the account
            immediately.
          </p>
          <ul className="u-margin--bottom">
            {describeChanges(pendingChanges, staffAccount).map(
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

export default EditStaffAccountForm;
