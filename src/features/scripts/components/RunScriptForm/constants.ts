import * as Yup from "yup";
import type { FormProps } from "./types";
import moment from "moment";

export const INITIAL_VALUES: FormProps = {
  access_group: "",
  deliver_after: "",
  deliverImmediately: true,
  instanceIds: [],
  queryType: "tags",
  tags: [],
  username: "root",
  time_limit: 300,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  deliverImmediately: Yup.boolean().required("This field is required."),
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) =>
      schema.required("This field is required").test({
        test: (value) =>
          moment(value).isValid() && moment(value).isAfter(moment()),
        message: "You have to enter a valid date and time in the future",
      }),
  }),
  instanceIds: Yup.array()
    .of(Yup.number())
    .when("queryType", {
      is: "ids",
      then: (schema) => schema.min(1, "At least one instance is required."),
    }),
  queryType: Yup.string().required("This field is required."),
  tags: Yup.array()
    .of(Yup.string())
    .when("queryType", {
      is: "tags",
      then: (schema) => schema.min(1, "At least one tag is required."),
    }),
  username: Yup.string().required("This field is required."),
});
