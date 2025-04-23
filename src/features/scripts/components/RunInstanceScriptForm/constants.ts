import * as Yup from "yup";
import type { RunInstanceScriptFormValues } from "../../types";
import moment from "moment";

export const INITIAL_VALUES: RunInstanceScriptFormValues = {
  in_access_group: "",
  deliverImmediately: true,
  deliver_after: "",
  script_id: 0,
  time_limit: 300,
  username: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  script_id: Yup.number().min(1, "This field is required"),
  access_group: Yup.string(),
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
