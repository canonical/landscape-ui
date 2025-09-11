import RadioGroup from "@/components/form/RadioGroup";
import ScheduleBlock from "@/components/form/ScheduleBlock";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { getFormikError } from "@/utils/formikErrors";
import { Input } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";
import classes from "./useSecurityProfileFormScheduleStep.module.scss";
import { RandomizationBlock } from "@/components/form/DeliveryScheduling";

export default function useSecurityProfileFormScheduleStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>) {
  return {
    isValid:
      !formik.errors.start_type &&
      !formik.errors.start_date &&
      !formik.errors.every &&
      !formik.errors.end_date &&
      !formik.errors.deliver_delay_window &&
      !formik.errors.restart_deliver_delay,
    description:
      "Add a schedule for the security profile. Select a specific date or a recurring schedule for continuous audit generation.",
    content: (
      <>
        <ScheduleBlock formik={formik} />

        {formik.values.mode == "audit-fix-restart" && (
          <>
            <LabelWithDescription
              label="Restart schedule"
              description="You can choose when to perform the required restart."
            />

            <RadioGroup
              field={"delivery_time"}
              formik={formik}
              label="Delivery time"
              inputs={[
                { label: "As soon as possible", key: "asap", value: "asap" },
                {
                  label: "Delayed",
                  value: "delayed",
                  key: "delayed",
                  expansion: (
                    <div className={classes.inputContainer}>
                      <Input
                        type="number"
                        required
                        className={classes.input}
                        wrapperClassName={classes.inputWrapper}
                        {...formik.getFieldProps("restart_deliver_delay")}
                        error={getFormikError(formik, "restart_deliver_delay")}
                      />

                      <span className={classes.inputDescription}>hours</span>
                    </div>
                  ),
                },
              ]}
            />

            <RandomizationBlock formik={formik} />
          </>
        )}
      </>
    ),
    submitButtonText: "Next",
  };
}
