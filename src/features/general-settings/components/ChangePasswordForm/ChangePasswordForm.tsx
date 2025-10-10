import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import PasswordConstraints from "@/components/form/PasswordConstraints";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Form, Input, PasswordToggle } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useUserGeneralSettings } from "../../hooks";
import { VALIDATION_SCHEMA } from "./constants";

interface FormProps {
  currentPassword: string;
  newPassword: string;
}

const ChangePasswordForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { changePassword } = useUserGeneralSettings();
  const { mutateAsync: changePasswordMutation } = changePassword;

  const formik = useFormik<FormProps>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await changePasswordMutation({
          password: values.currentPassword,
          new_password: values.newPassword,
        });
        closeSidePanel();
        notify.success({
          message: "Password changed successfully",
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        error={
          formik.touched.currentPassword && formik.errors.currentPassword
            ? formik.errors.currentPassword
            : undefined
        }
        {...formik.getFieldProps("currentPassword")}
      />
      <PasswordToggle
        required
        id="new-password"
        label="New password"
        autoComplete="new-password"
        data-testid="new-password"
        error={
          formik.touched.newPassword &&
          formik.errors.newPassword &&
          formik.errors.newPassword === "This field is required"
            ? formik.errors.newPassword
            : undefined
        }
        {...formik.getFieldProps("newPassword")}
      />

      <PasswordConstraints
        password={formik.values.newPassword}
        touched={!!formik.touched.newPassword}
        hasError={!!formik.errors.newPassword}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default ChangePasswordForm;
