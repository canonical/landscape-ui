import moment from "moment";
import * as Yup from "yup";

export const KERNEL_ACTIONS_VALIDATION_SCHEMA = Yup.object().shape({
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
