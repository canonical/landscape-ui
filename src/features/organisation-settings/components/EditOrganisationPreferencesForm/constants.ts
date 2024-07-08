import { ListFilter } from "@/types/Filters";
import * as Yup from "yup";

type FormKey =
  | "organisationName"
  | "useRegistrationKey"
  | "registrationKey"
  | "autoRegisterNewComputers";

export const FORM_FIELDS: { [key in FormKey]: ListFilter } = {
  organisationName: {
    slug: "organisationName",
    label: "Organisation's name",
    type: "text",
  },
  useRegistrationKey: {
    slug: "useRegistrationKey",
    label: "Use registration key",
    type: "checkbox",
  },
  registrationKey: {
    slug: "registrationKey",
    label: "Registration key",
    type: "text",
  },
  autoRegisterNewComputers: {
    slug: "autoRegisterNewComputers",
    label: "Auto register new computers",
    type: "checkbox",
  },
};

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
