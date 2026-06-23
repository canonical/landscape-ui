import type { HoldFormValues } from "./types";
import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";
import moment from "moment";
import * as Yup from "yup";

export const INITIAL_VALUES: HoldFormValues = {
  hold: "forever",
  hold_until: "",
  deliver_immediately: true,
  randomize_delivery: false,
  deliver_delay_window: 0,
  deliver_after: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
  hold: Yup.string(),
  hold_until: Yup.string().test({
    test: (value) => {
      if (!value) {
        return true;
      }
      return moment(value).isValid();
    },
    message: "You have to enter a valid date and time",
  }),
});
