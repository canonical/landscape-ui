import type { SnapFormValues } from "./types";
import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";
import * as Yup from "yup";

export const INITIAL_VALUES: SnapFormValues = {
  deliver_immediately: true,
  randomize_delivery: false,
  deliver_delay_window: 0,
  deliver_after: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
});
