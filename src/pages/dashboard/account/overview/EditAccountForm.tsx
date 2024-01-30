import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC, useState } from "react";
import * as Yup from "yup";
import useDebug from "../../../../hooks/useDebug";
import { AuthUser } from "../../../../context/auth";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";

interface FormProps {
  title: string;
  registration_key: string;
}

interface EditAccountFormProps {
  user: AuthUser;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EditAccountForm: FC<EditAccountFormProps> = ({ user }) => {
  const [isLoading, setLoading] = useState(false);
  const debug = useDebug();
  const formik = useFormik<FormProps>({
    initialValues: {
      title: user.name,
      registration_key: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("This field is required"),
      registration_key: Yup.string()
        .matches(/^[^;\s#]+$/, "Invalid characters: semicolon or hashtag")
        .nullable(),
    }),
    onSubmit: async () => {
      setLoading(true);

      try {
        // TODO: call edit account api
        await delay(500);
        throw new Error("Error happened");
      } catch (error) {
        debug(error);
      }

      setLoading(false);
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Title"
        required
        id="Title"
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
        {...formik.getFieldProps("title")}
      />
      <Input
        type="text"
        label="Registration key"
        help="The key used by computers when registering with this account. An empty key means clients may register without providing a key. Trailing spaces or ; or # symbols are not allowed."
        error={
          formik.touched.registration_key && formik.errors.registration_key
            ? formik.errors.registration_key
            : undefined
        }
        id="registration_key"
        {...formik.getFieldProps("registration_key")}
      />
      <SidePanelFormButtons
        disabled={isLoading}
        submitButtonText="Save changes"
        removeButtonMargin
      />
    </Form>
  );
};

export default EditAccountForm;
