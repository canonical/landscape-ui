import * as Yup from "yup";

export const getValidationSchema = (action: "add" | "create" | "edit") => {
  return Yup.object().shape({
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    days_without_exchange: Yup.number()
      .test({
        name: "required",
        message: "This field is required.",
        params: { action },
        test: (value) => !!value || !["add", "create"].includes(action),
      })
      .integer("Timeframe must be an integer value.")
      .min(1, "Timeframe must be at least 1.")
      .max(2147483647, "Timeframe must be less than 2147483648."),
    tags: Yup.array().of(Yup.string()),
    title: Yup.string().test({
      name: "required",
      message: "This field is required.",
      params: { action },
      test: (value) => !!value || !["add", "create"].includes(action),
    }),
  });
};
