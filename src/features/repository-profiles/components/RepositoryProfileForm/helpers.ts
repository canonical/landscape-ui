import * as Yup from "yup";

export const getValidationSchema = (action: "add" | "edit") => {
  return Yup.object().shape({
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    apt_sources: Yup.array().min(1, "At least one source is required."),
    description: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    title: Yup.string().test({
      message: "This field is required.",
      params: { action },
      test: (value) => action !== "add" || !!value,
    }),
  });
};
