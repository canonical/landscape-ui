import MultiSelectField from "@/components/form/MultiSelectField";
import { Col, Input, Row, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { FC } from "react";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import {
  DAY_OPTIONS,
  MONTH_OPTIONS,
} from "../SecurityProfileScheduleBlock/constants";
import { getOnOptions } from "../SecurityProfileScheduleBlock/helpers";
import { toCronPhrase } from "./helpers";

const SecurityProfileRecurringScheduleBlock: FC<{
  readonly currentDate: string;
  readonly formik: FormikContextType<SecurityProfileAddFormValues>;
}> = ({ currentDate, formik }) => {
  if (formik.values.useCronJobFormat) {
    try {
      const [minute, hour, daysOfMonth, months, daysOfWeek] =
        formik.values.cronSchedule.split(" ");

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
          help={`“At ${hour}:${minute} on ${dayOfMonthPhrase} in ${monthPhrase} on ${dayOfWeekPhrase}.”`}
          {...formik.getFieldProps("cronSchedule")}
        />
      );
    } catch (error) {
      return (
        <Input
          type="text"
          label="Schedule"
          error={error instanceof Error ? error.message : "Invalid format."}
          {...formik.getFieldProps("cronSchedule")}
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
        {...formik.getFieldProps("startDate")}
      />

      <Row className="u-no-padding">
        <Col size={6}>
          <Input
            type="number"
            label="Repeat every"
            min={formik.values.repeatEveryType == "days" ? 7 : 1}
            {...formik.getFieldProps("repeatEvery")}
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
              formik.values.repeatEvery == 1
                ? option
                : { ...option, label: `${option.label}s` },
            )}
            {...formik.getFieldProps("repeatEveryType")}
          />
        </Col>
      </Row>

      {formik.values.repeatEveryType == "weeks" && (
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
        />
      )}

      {formik.values.repeatEveryType == "months" && formik.values.startDate && (
        <Select
          label="On"
          options={getOnOptions(new Date(formik.values.startDate))}
        />
      )}

      {formik.values.repeatEveryType == "years" && (
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
        />
      )}

      <Select
        label="Ends"
        options={[
          { label: "Never", value: "never" },
          { label: "On a date", value: "onADate" },
        ]}
        {...formik.getFieldProps("ends")}
      />

      {formik.values.ends == "onADate" && (
        <Input
          type="datetime-local"
          label="End date"
          min={formik.values.startDate}
          {...formik.getFieldProps("endDate")}
        />
      )}
    </>
  );
};

export default SecurityProfileRecurringScheduleBlock;
