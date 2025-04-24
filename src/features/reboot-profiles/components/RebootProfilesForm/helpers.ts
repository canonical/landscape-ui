import * as Yup from "yup";
import type {
  FormProps,
  RebootProfileDay,
  RebootProfilesFormProps,
} from "./types";

export const getValidationSchema = (action: "add" | "edit" | "duplicate") => {
  return Yup.object().shape({
    title: Yup.string().test({
      name: "required",
      message: "This field is required.",
      test: (value) => !!value || action !== "add",
    }),
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    at_hour: Yup.number()
      .required("Hour is required.")
      .integer("Hour must be an integer.")
      .min(0, "Hour must be between 0 and 23.")
      .max(23, "Hour must be between 0 and 23."),
    at_minute: Yup.number()
      .required("Minute is required.")
      .integer("Minute must be an integer.")
      .min(0, "Minute must be between 0 and 59.")
      .max(59, "Minute must be between 0 and 59."),
    randomize_delivery: Yup.boolean(),
    deliver_delay_window: Yup.number().when("randomize_delivery", {
      is: true,
      then: (schema) =>
        schema
          .required("This field is required.")
          .integer("This field must be an integer.")
          .max(
            43200,
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
    tags: Yup.array().of(Yup.string()),
    on_days: Yup.array()
      .of(Yup.string<RebootProfileDay>())
      .min(1, "At least one day must be selected."),
  });
};

export const getInitialValues = (
  props: RebootProfilesFormProps,
  accessGroupOptions?: { value: string; label: string }[],
): FormProps => {
  if (props.action === "add") {
    return {
      title: "",
      access_group: accessGroupOptions?.[0]?.value || "",
      all_computers: false,
      randomize_delivery: false,
      deliver_delay_window: "",
      tags: [],
      at_hour: "",
      at_minute: "",
      deliver_within: 0,
      on_days: [],
    };
  }

  return {
    title:
      props.action === "duplicate"
        ? `${props.profile.title} (copy)`
        : props.profile.title,
    access_group: props.profile.access_group,
    all_computers: props.profile.all_computers,
    randomize_delivery: props.profile.deliver_delay_window ? true : false,
    deliver_delay_window: props.profile.deliver_delay_window.toString() || "",
    tags: props.profile.tags,
    at_hour: props.profile.at_hour,
    at_minute: props.profile.at_minute,
    deliver_within: props.profile.deliver_within,
    on_days: props.profile.on_days,
  };
};
