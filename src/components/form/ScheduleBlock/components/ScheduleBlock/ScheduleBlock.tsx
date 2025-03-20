import Indent from "@/components/layout/Indent";
import { CustomSelect } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ScheduleBlockFormProps } from "../../types";
import ScheduleBlockBase from "../ScheduleBlockBase";

interface ScheduleBlockProps<T extends ScheduleBlockFormProps> {
  readonly currentDate: string;
  readonly formik: FormikContextType<T>;
}

const ScheduleBlock = <T extends ScheduleBlockFormProps>({
  currentDate,
  formik,
}: ScheduleBlockProps<T>) => {
  return (
    <>
      <CustomSelect
        label="Schedule"
        options={[
          { label: "On a date", value: "on-a-date" },
          { label: "Recurring", value: "recurring" },
        ]}
        value={formik.values.start_type}
        onChange={async (value) => formik.setFieldValue("start_type", value)}
        required
      />

      <Indent>
        <ScheduleBlockBase currentDate={currentDate} formik={formik} />
      </Indent>
    </>
  );
};

export default ScheduleBlock;
