import {
  randomizationValidationSchema,
  deliveryValidationSchema,
} from "@/components/form/DeliveryScheduling";
import * as Yup from "yup";

export const KERNEL_ACTIONS_VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
  new_kernel_version_id: Yup.string().required("You have to select a kernel"),
  reboot_after: Yup.boolean(),
});
