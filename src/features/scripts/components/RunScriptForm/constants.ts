import * as Yup from "yup";
import type { FormProps } from "./types";
import { deliveryValidationSchema } from "@/components/form/DeliveryScheduling";

export const INITIAL_VALUES: FormProps = {
  deliver_after: "",
  deliver_immediately: true,
  instanceIds: [],
  queryType: "tags",
  tags: [],
  username: "root",
  time_limit: 300,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  access_group: Yup.string(),
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
