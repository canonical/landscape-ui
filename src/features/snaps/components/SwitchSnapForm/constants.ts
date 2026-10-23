import type { SwitchFormValues } from "./types";
import {
  deliveryValidationSchema,
  randomizationValidationSchema,
} from "@/components/form/DeliveryScheduling";
import * as Yup from "yup";
import { isValidRevision } from "../../helpers";

export const INITIAL_VALUES: SwitchFormValues = {
  mode: "channel",
  value: "",
  deliver_immediately: true,
  randomize_delivery: false,
  deliver_delay_window: 0,
  deliver_after: "",
};

// Revision errors are rendered by SnapChannelRevisionFields, so the revision
// rule only blocks submission. The channel error is rendered as the form error
// because the channel select is disabled when there are no channels.
export const VALIDATION_SCHEMA = Yup.object().shape({
  ...deliveryValidationSchema,
  ...randomizationValidationSchema,
  value: Yup.string().when("mode", {
    is: "revision",
    then: (schema) => schema.test((value) => isValidRevision(value ?? "")),
    otherwise: (schema) =>
      schema.required("Select a channel or specify a revision to switch to"),
  }),
});
