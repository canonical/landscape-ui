import * as Yup from "yup";
import type { FormProps } from "./types";
import { deliveryValidationSchema } from "@/components/form/DeliveryScheduling";

export const NO_TAGGED_FEATURED_INSTANCES_WARNING_MESSAGE =
  "There are no instances with the selected tags that can run scripts.";

// Both instance queries are detached from the page's URL pagination, so the
// "Instance names" picker and the tag preview no longer inherit the scripts
// list's page size and offset. The preview is capped: the run itself submits
// the tag query, so the server resolves the full target set.
export const INSTANCE_OPTIONS_LIMIT = 1000;
export const TAGGED_INSTANCES_PREVIEW_LIMIT = 100;

export const INITIAL_VALUES: Omit<FormProps, "code"> = {
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
  code: Yup.string().required("This field is required."),
});
