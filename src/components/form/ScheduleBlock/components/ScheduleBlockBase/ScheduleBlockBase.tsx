import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Input, Row, Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import moment from "moment";
import type { ScheduleBlockFormProps } from "../../types";
import OnSelect from "../OnSelect";

interface ScheduleBlockProps<T extends ScheduleBlockFormProps> {
  readonly formik: FormikContextType<T>;
}

const ScheduleBlockBase = <T extends ScheduleBlockFormProps>({
  formik,
}: ScheduleBlockProps<T>) => {
  const currentDate = moment().format(INPUT_DATE_TIME_FORMAT);

  switch (formik.values.start_type) {
    case "on-a-date":
      return (
        <Input
          type="datetime-local"
          label="Date"
          min={currentDate}
          {...formik.getFieldProps("start_date")}
          error={getFormikError(formik, "start_date")}
          required
        />
      );

    case "recurring":
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
                {...formik.getFieldProps("every")}
                type="number"
                label="Repeat every"
                min={1}
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
                    value: "DAILY",
                  },
                  {
                    label: "Week",
                    value: "WEEKLY",
                  },
                  {
                    label: "Month",
                    value: "MONTHLY",
                  },
                  {
                    label: "Year",
                    value: "YEARLY",
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

          <OnSelect formik={formik} />

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
  }
};

export default ScheduleBlockBase;
