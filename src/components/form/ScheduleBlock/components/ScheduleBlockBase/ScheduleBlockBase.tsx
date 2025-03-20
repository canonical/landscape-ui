import { Input } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ScheduleBlockFormProps } from "../../types";
import RecurringScheduleBlock from "../RecurringScheduleBlock";

interface ScheduleBlockProps<T extends ScheduleBlockFormProps> {
  readonly currentDate: string;
  readonly formik: FormikContextType<T>;
}

const ScheduleBlockBase = <T extends ScheduleBlockFormProps>({
  currentDate,
  formik,
}: ScheduleBlockProps<T>) => {
  switch (formik.values.start_type) {
    case "on-a-date":
      return (
        <Input
          type="datetime-local"
          label="Date"
          min={currentDate}
          {...formik.getFieldProps("start_date")}
          required
        />
      );
    case "recurring":
      return (
        <RecurringScheduleBlock currentDate={currentDate} formik={formik} />
      );
  }
};

export default ScheduleBlockBase;
