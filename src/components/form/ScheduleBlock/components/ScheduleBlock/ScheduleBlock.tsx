import Indent from "@/components/layout/Indent";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ScheduleBlockFormProps } from "../../types";
import ScheduleBlockBase from "../ScheduleBlockBase";

interface ScheduleBlockProps<T extends ScheduleBlockFormProps> {
  readonly formik: FormikContextType<T>;
}

const ScheduleBlock = <T extends ScheduleBlockFormProps>({
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
        <ScheduleBlockBase formik={formik} />
      </Indent>
    </>
  );
};

export default ScheduleBlock;
