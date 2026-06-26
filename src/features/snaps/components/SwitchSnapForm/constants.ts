import type { SwitchFormValues } from "./types";
import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";
import * as Yup from "yup";

export const INITIAL_VALUES: SwitchFormValues = {
  release: "",
  deliver_immediately: true,
  randomize_delivery: false,
  deliver_delay_window: 0,
  deliver_after: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
  release: Yup.string().required("Release is required"),
});
