import * as Yup from "yup";
import type { FormProps } from "./types";
import { deliveryValidationSchema } from "@/components/form/DeliveryScheduling";

export const INITIAL_VALUES: FormProps = {
  deliver_immediately: true,
  deliver_after: "",
  script_id: 0,
  time_limit: 300,
  username: "root",
  script: null,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  script_id: Yup.number().min(1, "This field is required"),
  time_limit: Yup.number(),
  username: Yup.string().required("This field is required."),
});
