import moment from "moment";
import * as Yup from "yup";
import type { FormProps } from "./types";

export const VALIDATION_SCHEMA = Yup.object().shape({
  deliver_immediately: Yup.boolean(),
  randomize_delivery: Yup.boolean(),
  deliver_delay_window: Yup.number().min(
    0,
    "Delivery delay must be greater than or equal to 0",
  ),
  deliver_after: Yup.string().test({
    test: (value) => {
      if (!value) {
        return true;
      }
      return moment(value).isValid();
    },
    message: "You have to enter a valid date and time",
  }),
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
