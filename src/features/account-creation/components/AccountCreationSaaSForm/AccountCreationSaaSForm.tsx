import {
  ActionButton,
  Form,
  Input,
  Notification,
} from "@canonical/react-components";
import type { FC } from "react";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import { useFormik } from "formik";
import { getFormikError } from "@/utils/formikErrors";
import { useCreateSaaSAccount } from "../../api";
import useDebug from "@/hooks/useDebug";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { FormValues } from "./types";
import classes from "./AccountCreationSaaSForm.module.scss";
import classNames from "classnames";

const AccountCreationSaaSForm: FC = () => {
  const debug = useDebug();
  const {
    createSaaSAccount: createAccount,
    isCreatingSaaSAccount: isCreatingAccount,
  } = useCreateSaaSAccount();

  const handleSubmit = async (values: FormValues) => {
    try {
      await createAccount({ title: values.title });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  return (
    <AuthTemplate title="Create a new Landscape SaaS account">
      <Notification severity="caution">
        There is no Landscape organization related to your account.
      </Notification>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Input
          type="text"
          label="Organization name"
          required
          help="This will be the name of the Landscape account for your organization."
          {...formik.getFieldProps("title")}
          error={getFormikError(formik, "title")}
        />

        <ActionButton
          className={classNames("u-no-margin--bottom", classes.button)}
          appearance="positive"
          type="submit"
          loading={isCreatingAccount}
          disabled={isCreatingAccount}
        >
          Create account
        </ActionButton>
      </Form>
    </AuthTemplate>
  );
};

export default AccountCreationSaaSForm;
