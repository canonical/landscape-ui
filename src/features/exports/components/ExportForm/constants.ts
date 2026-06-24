import moment from "moment";
import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().trim().required("This field is required"),
  selectedFieldIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "Select at least one attribute"),
  retainUntil: Yup.string()
    .required("This field is required")
    .test(
      "retain-until-future",
      "Must be a date in the future",
      (value) => !!value && moment(value).isAfter(moment().startOf("day")),
    )
    .test(
      "retain-until-max",
      "Must be within 100 years from today",
      (value) =>
        !!value && moment(value).isSameOrBefore(moment().add(100, "years")),
    ),
});
