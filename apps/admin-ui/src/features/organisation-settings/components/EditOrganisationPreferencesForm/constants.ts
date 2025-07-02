import * as Yup from "yup";

export const REGISTRATION_KEY_REGEX = /^(?!.*[;#])(?!.*\s$).+$/;

export const VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  use_registration_key: Yup.boolean(),
  registration_password: Yup.string().when("use_registration_key", {
    is: true,
    then: (schema) =>
      schema
        .required("This field is required")
        .min(3, "Registration key must be at least 3 characters")
        .matches(
          REGISTRATION_KEY_REGEX,
          "The key cannot contain trailing spaces or ; or # symbols",
        ),
  }),
  auto_register_new_computers: Yup.boolean(),
});
