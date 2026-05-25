import type { WslProfile } from "../../../../types";
import * as Yup from "yup";

export const getValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
    all_computers: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
  });
};

export const getCloudInitValue = (profile: WslProfile) => {
  if (profile.cloud_init_contents) return "Plain text";
  if (profile.cloud_init_secret_name) return "From a file";
  return "None";
};
