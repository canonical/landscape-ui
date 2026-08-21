import date from "@/libs/date";
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
      (value) => !!value && date(value).isAfter(date().format("YYYY-MM-DD")),
    )
    .test(
      "retain-until-max",
      "Must be within 100 years from today",
      (value) =>
        !!value && date(value).isSameOrBefore(date().add(100, "years")),
    ),
});
