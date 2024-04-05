import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useUserDetails from "@/hooks/useUserDetails";
import { Form, Input, PasswordToggle } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

interface FormProps {
  currentPassword: string;
  newPassword: string;
}

const ChangePasswordForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { changePassword } = useUserDetails();
  const { mutateAsync: changePasswordMutation, isLoading } = changePassword;
  const formik = useFormik<FormProps>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: Yup.object().shape({
      currentPassword: Yup.string().required("This field is required"),
      newPassword: Yup.string()
        .required("This field is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    }),
    onSubmit: async (values) => {
      try {
        changePasswordMutation({
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
        label="Current"
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
        help="Password must contain lowercase letters, uppercase letters, numbers and be minimum 8 characters long"
        autoComplete="new-password"
        error={
          formik.touched.newPassword && formik.errors.newPassword
            ? formik.errors.newPassword
            : undefined
        }
        {...formik.getFieldProps("newPassword")}
      />
      <SidePanelFormButtons
        disabled={isLoading}
        submitButtonText="Save changes"
        removeButtonMargin
      />
    </Form>
  );
};

export default ChangePasswordForm;
