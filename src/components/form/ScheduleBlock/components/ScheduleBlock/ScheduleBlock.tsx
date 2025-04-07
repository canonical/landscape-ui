import Indent from "@/components/layout/Indent";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ComponentProps } from "react";
import type { ScheduleBlockFormProps } from "../../types";
import ScheduleBlockBase from "../ScheduleBlockBase";

interface ScheduleBlockProps<T extends ScheduleBlockFormProps>
  extends Omit<ComponentProps<typeof ScheduleBlockBase>, "formik"> {
  readonly formik: FormikContextType<T>;
}

const ScheduleBlock = <T extends ScheduleBlockFormProps>({
  currentDate,
  formik,
}: ScheduleBlockProps<T>) => {
  return (
    <>
      <Select
        label="Schedule"
        options={[
          { label: "Select", value: "", hidden: true },
          { label: "On a date", value: "on-a-date" },
          { label: "Recurring", value: "recurring" },
        ]}
        {...formik.getFieldProps("start_type")}
        required
      />

      <Indent>
        <ScheduleBlockBase currentDate={currentDate} formik={formik} />
      </Indent>
    </>
  );
};

export default ScheduleBlock;
