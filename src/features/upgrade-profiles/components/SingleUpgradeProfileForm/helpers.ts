import * as Yup from "yup";
import type {
  UpgradeProfileDay,
  UpgradeProfileFrequency,
  UpgradeProfileType,
} from "../../types";
import {
  MAX_DELIVERY_DELAY_WINDOW,
  MAX_HOURS_IN_DAY,
  MAX_MINUTES_IN_HOUR,
} from "@/constants";

export const getValidationSchema = (action: "add" | "edit") => {
  return Yup.object().shape({
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    at_hour: Yup.number().when("every", {
      is: "week",
      then: (schema) =>
        schema
          .required("Hour is required.")
          .integer("Hour must be an integer.")
          .min(0, "Hour must be between 0 and 23.")
          .max(MAX_HOURS_IN_DAY, "Hour must be between 0 and 23."),
    }),
    at_minute: Yup.number()
      .required("Minute is required.")
      .integer("Minute must be an integer.")
      .min(0, "Minute must be between 0 and 59.")
      .max(MAX_MINUTES_IN_HOUR, "Minute must be between 0 and 59."),
    deliver_delay_window: Yup.number().when("randomizeDelivery", {
      is: true,
      then: (schema) =>
        schema
          .required("This field is required.")
          .integer("This field must be an integer.")
          .max(
            MAX_DELIVERY_DELAY_WINDOW,
            "Deliver delay window in minutes must be a number less than or equal to 30 days (43200 minutes)",
          )
          .test(
            (value, { createError, parent }) =>
              value < parseInt(parent.deliver_within) * 60 ||
              createError({
                message: `Deliver delay window of '${value}' minutes should be shorter than the 'deliver within' expiration time of ${parent.deliver_within} ${parent.deliver_within === "1" ? "hour" : "hours"}.`,
              }),
          )
          .min(0, "Deliver delay window must be at least 0."),
    }),
    deliver_within: Yup.number()
      .integer("'Expires after' must be an integer.")
      .min(0, "'Expires after' must be at least 0."),
    every: Yup.string<UpgradeProfileFrequency>().required(
      "This field is required.",
    ),
    on_days: Yup.array()
      .of(Yup.string<UpgradeProfileDay>())
      .when("every", {
        is: "week",
        then: (schema) => schema.min(1, "At least one day must be selected."),
      }),
    randomizeDelivery: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
    title: Yup.string().test({
      name: "required",
      message: "This field is required.",
      params: { action },
      test: (value) => !!value || action !== "add",
    }),
    upgrade_type: Yup.string<UpgradeProfileType>().required(
      "This field is required.",
    ),
  });
};
