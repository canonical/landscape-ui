import * as Yup from "yup";

export const editUserValidationSchema = Yup.object().shape({
  username: Yup.string().required("This field is required"),
  name: Yup.string(),
  password: Yup.string(),
  confirmPassword: Yup.string().when("password", ([password], schema) => {
    return password && password.length > 0
      ? schema
          .trim()
          .required("Confirm password is required")
          .oneOf([Yup.ref("password"), ""], "Passwords must match")
      : schema.notRequired();
  }),
  location: Yup.string(),
  homePhoneNumber: Yup.string(),
  workPhoneNumber: Yup.string(),
  primaryGroupValue: Yup.string().required("This field is required"),
  additionalGroupValue: Yup.array().of(Yup.string()),
});
