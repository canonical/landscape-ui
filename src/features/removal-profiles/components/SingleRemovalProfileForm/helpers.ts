import * as Yup from "yup";

const MAX_DAYS_WITHOUT_EXCHANGE = 2147483647;

export const getValidationSchema = (action: "add" | "edit") => {
  return Yup.object().shape({
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    days_without_exchange: Yup.number()
      .test({
        name: "required",
        message: "This field is required.",
        params: { action },
        test: (value) =>
          (value !== undefined && value !== null) || action !== "add",
      })
      .integer("Timeframe must be an integer value.")
      .min(1, "Timeframe must be at least 1.")
      .max(
        MAX_DAYS_WITHOUT_EXCHANGE,
        `Timeframe must be at most  ${MAX_DAYS_WITHOUT_EXCHANGE}.`,
      ),
    tags: Yup.array().of(Yup.string()),
    title: Yup.string().test({
      name: "required",
      message: "This field is required.",
      params: { action },
      test: (value) => !!value || action !== "add",
    }),
  });
};
