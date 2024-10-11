import * as Yup from "yup";
import moment from "moment";

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
  new_kernel_version_id: Yup.string().required("You have to select a kernel"),
  reboot_after: Yup.boolean(),
});

export const UPGRADE_MESSAGE_WITH_REBOOT =
  "The kernel will be upgraded and the instance will restart afterwards to apply the change and any associated patches.";
export const UPGRADE_MESSAGE_WITHOUT_REBOOT =
  "The kernel will be upgraded. You'll need to restart the instance to apply this change and any associated patches.";
export const NOTIFICATION_MESSAGE =
  "Restart after upgrade to apply the patches";
