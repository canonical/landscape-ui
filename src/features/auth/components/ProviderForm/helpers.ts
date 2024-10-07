import * as Yup from "yup";
import { IdentityProvider } from "../../types";

export const getValidationSchema = (provider: IdentityProvider | null) => {
  return Yup.object().shape({
    client_id:
      provider?.provider === "ubuntu-one"
        ? Yup.string()
        : Yup.string().required("This field is required"),
    client_secret:
      provider?.provider === "ubuntu-one"
        ? Yup.string()
        : Yup.string().required("This field is required"),
    enabled: Yup.boolean(),
    issuer:
      provider?.provider === "ubuntu-one"
        ? Yup.string()
        : Yup.string().url().required("This field is required"),
    name:
      provider?.provider === "ubuntu-one"
        ? Yup.string()
        : Yup.string().required("This field is required"),
  });
};
