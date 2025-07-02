import moment from "moment";
import * as Yup from "yup";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  deliverImmediately: true,
  deliver_after: "",
  script_id: 0,
  time_limit: 300,
  username: "root",
  script: null,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  script_id: Yup.number().min(1, "This field is required"),
  deliverImmediately: Yup.boolean().required(),
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) =>
      schema.required("This field is required").test({
        test: (value) =>
          moment(value).isValid() && moment(value).isAfter(moment()),
        message: "You have to enter a valid date and time in the future",
      }),
  }),
  time_limit: Yup.number(),
  username: Yup.string().required("This field is required."),
});
