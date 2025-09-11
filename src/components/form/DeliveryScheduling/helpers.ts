import * as Yup from "yup";
import moment from "moment";
import { MAX_DELIVERY_DELAY_WINDOW } from "@/constants";

export const deliveryValidationSchema = {
  deliver_immediately: Yup.boolean(),
  deliver_after: Yup.string().when("deliver_immediately", {
    is: false,
    then: (schema) =>
      schema.required("This field is required.").test({
        name: "is-in-future",
        message: "You have to enter a valid date and time in the future.",
        test: (value) =>
          moment(value).isValid() && moment(value).isAfter(moment()),
      }),
  }),
};

export const randomizationValidationSchema = {
  randomize_delivery: Yup.boolean(),
  deliver_delay_window: Yup.number().when("randomize_delivery", {
    is: true,
    then: (schema) =>
      schema
        .required("This field is required.")
        .integer("This field must be an integer.")
        .max(
          MAX_DELIVERY_DELAY_WINDOW,
          "Deliver delay window in minutes must be a number less than or equal to 30 days (43200 minutes)",
        )
        .test((value, { createError, parent }) => {
          if (parent.deliver_within === undefined) {
            return true;
          }

          return (
            value < parseInt(parent.deliver_within) * 60 ||
            createError({
              message: `Deliver delay window of '${value}' minutes should be shorter than the 'deliver within' expiration time of ${parent.deliver_within} ${parent.deliver_within === "1" ? "hour" : "hours"}.`,
            })
          );
        })
        .min(0, "Deliver delay window must be at least 0."),
  }),
};
