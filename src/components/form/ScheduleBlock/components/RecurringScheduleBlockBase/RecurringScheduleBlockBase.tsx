import MultiSelectField from "@/components/form/MultiSelectField";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Input, Row, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ScheduleBlockFormProps } from "../../types";
import { DAY_OPTIONS, MONTH_OPTIONS } from "./constants";
import { getOnOptions, toCronPhrase } from "./helpers";

interface RecurringScheduleBlockBaseProps<T extends ScheduleBlockFormProps> {
  readonly currentDate: string;
  readonly formik: FormikContextType<T>;
}

const RecurringScheduleBlockBase = <T extends ScheduleBlockFormProps>({
  currentDate,
  formik,
}: RecurringScheduleBlockBaseProps<T>) => {
  if (formik.values.is_cron) {
    try {
      const [minute, hour, daysOfMonth, months, daysOfWeek] =
        formik.values.cron_schedule.split(" ");

      const dayOfMonthPhrase = toCronPhrase(
        daysOfMonth ?? "",
        "day-of-month",
        30,
        1,
      );

      const monthPhrase = toCronPhrase(months ?? "", "month", 11, 1, {
        keys: [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ],
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      });

      const dayOfWeekPhrase = toCronPhrase(
        daysOfWeek ?? "",
        "day-of-week",
        6,
        0,
        {
          keys: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
          labels: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      );

      return (
        <Input
          type="text"
          label="Schedule"
          success={`“At ${hour}:${minute} on ${dayOfMonthPhrase} in ${monthPhrase} on ${dayOfWeekPhrase}.”`}
          {...formik.getFieldProps("cron_schedule")}
          required
        />
      );
    } catch (error) {
      return (
        <Input
          type="text"
          label="Schedule"
          error={error instanceof Error ? error.message : "Invalid format."}
          {...formik.getFieldProps("cron_schedule")}
          required
        />
      );
    }
  }

  return (
    <>
      <Input
        type="datetime-local"
        label="Start date"
        min={currentDate}
        {...formik.getFieldProps("start_date")}
        required
      />

      <Row className="u-no-padding">
        <Col size={6}>
          <Input
            type="number"
            label="Repeat every"
            min={formik.values.unit_of_time == "days" ? 7 : 1}
            {...formik.getFieldProps("every")}
            error={getFormikError(formik, "every")}
            required
          />
        </Col>

        <Col size={6}>
          <Select
            label="Repeat every"
            options={[
              {
                label: "Day",
                value: "days",
              },
              {
                label: "Week",
                value: "weeks",
              },
              {
                label: "Month",
                value: "months",
              },
              {
                label: "Year",
                value: "years",
              },
            ].map((option) =>
              formik.values.every == 1
                ? option
                : { ...option, label: `${option.label}s` },
            )}
            {...formik.getFieldProps("unit_of_time")}
            required
          />
        </Col>
      </Row>

      {formik.values.unit_of_time == "weeks" && (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={DAY_OPTIONS}
          selectedItems={DAY_OPTIONS.filter(({ value }) =>
            formik.values.on.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "on",
              items.map(({ value }) => value),
            )
          }
          required
        />
      )}

      {formik.values.unit_of_time == "months" && formik.values.start_date && (
        <Select
          label="On"
          options={getOnOptions(new Date(formik.values.start_date))}
          required
        />
      )}

      {formik.values.unit_of_time == "years" && (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={MONTH_OPTIONS}
          selectedItems={MONTH_OPTIONS.filter(({ value }) =>
            formik.values.on.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "on",
              items.map(({ value }) => value),
            )
          }
          required
        />
      )}

      <Select
        label="Ends"
        options={[
          { label: "Never", value: "never" },
          { label: "On a date", value: "on-a-date" },
        ]}
        {...formik.getFieldProps("end_type")}
        required
      />

      {formik.values.end_type == "on-a-date" && (
        <Input
          type="datetime-local"
          label="End date"
          min={formik.values.start_date}
          {...formik.getFieldProps("end_date")}
          error={getFormikError(formik, "end_date")}
          required
        />
      )}
    </>
  );
};

export default RecurringScheduleBlockBase;
