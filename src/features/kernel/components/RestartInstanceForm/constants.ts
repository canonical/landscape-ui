import * as Yup from "yup";
import type { FormProps } from "./types";
import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
  upgrade_and_restart: Yup.boolean(),
});

export const INITIAL_VALUES: FormProps = {
  deliver_immediately: true,
  randomize_delivery: false,
  deliver_delay_window: 0,
  deliver_after: "",
  upgrade_and_restart: false,
};

export const NOTIFICATION_MESSAGE =
  "To save patches, upgrade your kernel and then Restart. If you Restart without upgrading, you will lose patches until Livepatch automatically applies them again.";
