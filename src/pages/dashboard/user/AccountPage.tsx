import { Button, Form, Input } from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import { FC, useState } from "react";
import * as Yup from "yup";
import useAuth from "../../../hooks/useAuth";
import useDebug from "../../../hooks/useDebug";
import classes from "./AccountPage.module.scss";

interface FormProps {
  title: string;
  registration_key: string;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const AccountPage: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const debug = useDebug();
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  const formik = useFormik<FormProps>({
    initialValues: {
      title: user?.name,
      registration_key: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("This field is required"),
      registration_key: Yup.string()
        .matches(/^[^;\s#]+$/, "Invalid characters: semicolon or hashtag")
        .nullable(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await delay(500);
        console.log(values);
        throw new Error("Error happened");
        // const { data } = await axios.post<
        //   RequestResponse,
        //   AxiosResponse<RequestResponse>,
        //   RequestParams
        // >(`${API_URL}login`, {
        //   title: values.title,
        //   registration_key: values.registration_key,
        // });
      } catch (error) {
        debug(error);
      }

      setLoading(false);
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit} className={classes.form}>
      <p>Please provide the following information</p>
      <div className={classes.innerForm}>
        <Input
          type="text"
          label={"Title"}
          className={classNames(classes.input)}
          required
          help={"A short description of the account"}
          id={"Title"}
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
          className={classes.input}
          help={
            "The key used by computers when registering with this account. An empty key means clients may register without providing a key. Trailing spaces or ; or # symbols are not allowed."
          }
          error={
            formik.touched.registration_key && formik.errors.registration_key
              ? formik.errors.registration_key
              : undefined
          }
          id={"registration_key"}
          {...formik.getFieldProps("registration_key")}
        />
      </div>
      <Button
        appearance="positive"
        disabled={isLoading}
        className={classes.submitFormButton}
        type="submit"
      >
        Save
      </Button>
    </Form>
  );
};

export default AccountPage;
