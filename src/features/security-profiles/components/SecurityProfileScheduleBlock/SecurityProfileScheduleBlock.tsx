import { Input } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import { type FC } from "react";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import SecurityProfileRecurringSchedule from "../SecurityProfileRecurringSchedule";

const SecurityProfileScheduleBlock: FC<{
  readonly currentDate: string;
  readonly formik: FormikContextType<SecurityProfileAddFormValues>;
}> = ({ currentDate, formik }) => {
  switch (formik.values.schedule) {
    case "onADate":
      return (
        <Input
          type="datetime-local"
          label="Date"
          min={currentDate}
          {...formik.getFieldProps("startDate")}
        />
      );

    case "recurring":
      return (
        <SecurityProfileRecurringSchedule
          currentDate={currentDate}
          formik={formik}
        />
      );
  }
};

export default SecurityProfileScheduleBlock;
