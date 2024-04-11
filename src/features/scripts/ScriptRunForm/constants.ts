import { FormProps } from "./types";
import * as Yup from "yup";

export const INITIAL_VALUES: FormProps = {
  deliverImmediately: true,
  deliver_after: "",
  instanceIds: [],
  queryType: "tags",
  tags: [],
  username: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  deliverImmediately: Yup.boolean().required("This field is required."),
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) => schema.required("This field is required."),
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
