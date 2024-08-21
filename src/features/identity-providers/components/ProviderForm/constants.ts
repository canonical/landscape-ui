import * as Yup from "yup";
import { ProviderFormValues } from "./types";

export const INITIAL_VALUES: ProviderFormValues = {
  client_id: "",
  client_secret: "",
  enabled: false,
  issuer: "",
  name: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  client_id: Yup.string().required("This field is required"),
  client_secret: Yup.string().required("This field is required"),
  enabled: Yup.boolean(),
  issuer: Yup.string().url().required("This field is required"),
  name: Yup.string().required("This field is required"),
});
