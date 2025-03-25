import moment from "moment";
import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  all_computers: Yup.boolean(),
  access_group: Yup.string().required("This field is required."),
  base_profile: Yup.string().required("This field is required."),
  cron_schedule: Yup.string().when("start_type", ([start_type], schema) =>
    start_type == "recurring"
      ? schema.when("is_cron", ([is_cron]) =>
          is_cron ? schema.required("This field is required.") : schema,
        )
      : schema,
  ),
  delivery_time: Yup.string(),
  end_date: Yup.string().when("start_type", ([start_type], schema) =>
    start_type == "recurring"
      ? schema.when("is_cron", ([is_cron]) =>
          !is_cron
            ? schema.when("end_type", ([end_type]) =>
                end_type === "on-a-date"
                  ? schema
                      .required("This field is required.")
                      .when("start_date", ([start_date]) =>
                        schema.test({
                          test: (end_date) => {
                            return moment(end_date).isAfter(moment(start_date));
                          },
                          message: `The end date must be after the start date.`,
                        }),
                      )
                  : schema,
              )
            : schema,
        )
      : schema,
  ),
  end_type: Yup.string(),
  every: Yup.number().when("start_type", ([start_type], schema) =>
    start_type == "recurring"
      ? schema.when("is_cron", ([is_cron]) =>
          !is_cron
            ? schema
                .required("This field is required.")
                .when("unit_of_time", ([unit_of_time]) =>
                  unit_of_time === "days"
                    ? schema.min(7, "Minimum interval of 7 days.")
                    : schema.min(1, "Minimum interval of 1."),
                )
            : schema,
        )
      : schema,
  ),
  is_cron: Yup.boolean(),
  mode: Yup.string().required("This field is required."),
  name: Yup.string().required("This field is required."),
  on: Yup.array().of(Yup.string()),
  randomize_delivery: Yup.string(),
  start_date: Yup.string()
    .required("This field is required.")
    .test({
      test: (start_date) => moment(start_date).isAfter(moment()),
      message: `The date must be in the future.`,
    }),
  start_type: Yup.string().required("This field is required."),
  tags: Yup.array()
    .of(Yup.string())
    .when("all_computers", ([all_computers], schema) =>
      !all_computers ? schema.min(1, "At least one tag is required") : schema,
    ),
  unit_of_time: Yup.string(),
});
