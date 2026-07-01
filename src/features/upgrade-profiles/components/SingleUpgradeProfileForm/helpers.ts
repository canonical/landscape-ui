import { randomizationValidationSchema } from "@/components/form/DeliveryScheduling";
import { MAX_HOURS_IN_DAY, MAX_MINUTES_IN_HOUR } from "@/constants";
import type { ProfileDay } from "@/features/profiles";
import * as Yup from "yup";
import type {
  FormProps,
  UpgradeProfileFrequency,
  UpgradeProfileType,
} from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { SingleUpgradeProfileFormProps } from "./types";

export const getValidationSchema = (action: "add" | "edit") => {
  return Yup.object().shape({
    ...randomizationValidationSchema,
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
    deliver_within: Yup.number()
      .integer("'Expires after' must be an integer.")
      .min(0, "'Expires after' must be at least 0."),
    every: Yup.string<UpgradeProfileFrequency>().required(
      "This field is required.",
    ),
    on_days: Yup.array()
      .of(Yup.string<ProfileDay>())
      .when("every", {
        is: "week",
        then: (schema) => schema.min(1, "At least one day must be selected."),
      }),
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

export const getInitialValues = (
  props: SingleUpgradeProfileFormProps,
): FormProps => {
  const profile = props.action === "edit" ? props.profile : undefined;

  return props.action === "edit" && profile
    ? {
        access_group: profile.access_group,
        all_computers: profile.all_computers,
        at_hour: profile.at_hour ? parseInt(profile.at_hour) : ("" as const),
        at_minute: parseInt(profile.at_minute),
        autoremove: profile.autoremove,
        deliver_delay_window: parseInt(profile.deliver_delay_window),
        deliver_within: parseInt(profile.deliver_within),
        every: profile.every,
        on_days: profile.on_days ?? [],
        randomize_delivery: profile.deliver_delay_window !== "0",
        tags: profile.tags,
        title: profile.title,
        upgrade_type: profile.upgrade_type,
      }
    : INITIAL_VALUES;
};
