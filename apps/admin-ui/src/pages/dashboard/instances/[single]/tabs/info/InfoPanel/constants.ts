import type { ModalConfirmationFormProps } from "./types";
import * as Yup from "yup";
import moment from "moment";

export const INITIAL_VALUES: ModalConfirmationFormProps = {
  deliver_after: "",
  deliverImmediately: true,
  action: null,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) =>
      schema
        .required("This field is required")
        .test({
          message: "Invalid date",
          test: (value) => moment(value).isValid(),
        })
        .test({
          message: "Date must be in the future",
          test: (value) => moment(value).isAfter(),
        }),
  }),
  deliverImmediately: Yup.boolean(),
  action: Yup.mixed().oneOf(["shutdown", "reboot"]).required(),
});
