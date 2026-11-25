import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";
import * as Yup from "yup";
import type { SnapDeliveryFormValues } from "./types";

export const DELIVERY_INITIAL_VALUES: SnapDeliveryFormValues = {
  deliver_immediately: true,
  deliver_after: "",
  randomize_delivery: false,
  deliver_delay_window: 0,
};

export const DELIVERY_VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
});
