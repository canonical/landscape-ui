import {
  DEFAULT_ACCESS_GROUP_NAME,
  MAX_HOURS_IN_DAY,
  MAX_MINUTES_IN_HOUR,
} from "@/constants";
import * as Yup from "yup";
import { parseSchedule } from "../../helpers";
import type {
  FormProps,
  RebootProfileDay,
  RebootProfilesFormProps,
} from "./types";
import { randomizationValidationSchema } from "@/components/form/DeliveryScheduling";

export const getValidationSchema = (action: "add" | "edit" | "duplicate") => {
  return Yup.object().shape({
    ...randomizationValidationSchema,
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
      .max(MAX_HOURS_IN_DAY, "Hour must be between 0 and 23."),
    at_minute: Yup.number()
      .required("Minute is required.")
      .integer("Minute must be an integer.")
      .min(0, "Minute must be between 0 and 59.")
      .max(MAX_MINUTES_IN_HOUR, "Minute must be between 0 and 59."),
    deliver_within: Yup.number()
      .integer("'Expires after' must be an integer.")
      .min(0, "'Expires after' must be at least 0."),
    tags: Yup.array().of(Yup.string()),
    on_days: Yup.array()
      .of(Yup.string<RebootProfileDay>())
      .min(1, "At least one day must be selected."),
  });
};

export const getInitialValues = (props: RebootProfilesFormProps): FormProps => {
  if (props.action === "add") {
    return {
      title: "",
      access_group: DEFAULT_ACCESS_GROUP_NAME,
      all_computers: false,
      randomize_delivery: false,
      deliver_delay_window: 0,
      tags: [],
      at_hour: "",
      at_minute: "",
      deliver_within: 0,
      on_days: [],
    };
  }
  const { at_hour, at_minute, on_days } = parseSchedule(props.profile.schedule);

  return {
    title:
      props.action === "duplicate"
        ? `${props.profile.title} (copy)`
        : props.profile.title,
    access_group: props.profile.access_group,
    all_computers: props.profile.all_computers,
    randomize_delivery: props.profile.deliver_delay_window ? true : false,
    deliver_delay_window: props.profile.deliver_delay_window || 0,
    tags: props.profile.tags,
    at_hour: at_hour,
    at_minute: at_minute,
    deliver_within: props.profile.deliver_within,
    on_days: on_days,
  };
};
