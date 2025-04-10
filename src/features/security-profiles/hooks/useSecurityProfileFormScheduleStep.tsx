import RadioGroup from "@/components/form/RadioGroup";
import ScheduleBlock from "@/components/form/ScheduleBlock";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { getFormikError } from "@/utils/formikErrors";
import { Input } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";
import classes from "./useSecurityProfileFormScheduleStep.module.scss";

export default function useSecurityProfileFormScheduleStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>) {
  return {
    isValid:
      !formik.errors.start_type &&
      !formik.errors.start_date &&
      !formik.errors.every &&
      !formik.errors.end_date &&
      !formik.errors.restart_deliver_delay_window &&
      !formik.errors.restart_deliver_within,
    description:
      "Add a schedule for the security profile. Select a specific date or a recurring schedule for continuous audit generation.",
    content: (
      <>
        <ScheduleBlock formik={formik} />

        {formik.values.mode == "fix-restart-audit" && (
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
                { label: "As soon as possible", key: "asap" },
                {
                  label: "Delayed",
                  key: "delayed",
                  expansion: (
                    <div className={classes.inputContainer}>
                      <Input
                        type="number"
                        required
                        className={classes.input}
                        wrapperClassName={classes.inputWrapper}
                        {...formik.getFieldProps("restart_deliver_within")}
                        error={getFormikError(formik, "restart_deliver_within")}
                      />

                      <span className={classes.inputDescription}>hours</span>
                    </div>
                  ),
                },
              ]}
            />

            <RadioGroup
              field={"randomize_delivery"}
              formik={formik}
              label="Randomize delivery over a time window"
              inputs={[
                { label: "No", key: "no" },
                {
                  label: "Yes",
                  key: "yes",
                  expansion: (
                    <div className={classes.inputContainer}>
                      <Input
                        type="number"
                        required
                        className={classes.input}
                        wrapperClassName={classes.inputWrapper}
                        {...formik.getFieldProps(
                          "restart_deliver_delay_window",
                        )}
                        error={getFormikError(
                          formik,
                          "restart_deliver_delay_window",
                        )}
                      />

                      <span className={classes.inputDescription}>minutes</span>
                    </div>
                  ),
                },
              ]}
            />
          </>
        )}
      </>
    ),
    submitButtonText: "Next",
  };
}
