import { ActivityConfirmationFormProps } from "./types";
import * as Yup from "yup";
import moment from "moment";

export const INITIAL_VALUES: ActivityConfirmationFormProps = {
  deliver_after: "",
  deliverImmediately: true,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) =>
      schema
        .required("This field is required")
        .test({
          message: "Invalid date",
          test: (value) => moment(value).isValid(),
        })
        .test({
          message: "Date must be in the future",
          test: (value) => moment(value).isAfter(),
        }),
  }),
  deliverImmediately: Yup.boolean(),
});

export const ACTIVITY_INFO = {
  shutdown: {
    ctaLabel: "Shutdown",
    getDescription: (title: string) =>
      `This will shut down "${title}" instance.`,
    title: "Shut down instance",
  },
  reboot: {
    ctaLabel: "Restart",
    getDescription: (title: string) => `This will restart "${title}" instance.`,
    title: "Restart instance",
  },
};
