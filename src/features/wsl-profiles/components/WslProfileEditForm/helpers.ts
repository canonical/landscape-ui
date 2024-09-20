import * as Yup from "yup";

export const getValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
    access_group: Yup.string().required("This field is required"),
    all_computers: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
  });
};
