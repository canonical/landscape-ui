import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import { useState, type FC } from "react";
import { phrase } from "../../helpers";
import type { UseSecurityProfileFormProps } from "../../hooks/useSecurityProfileForm";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileForm.module.scss";

interface SecurityProfileFormProps
  extends Omit<UseSecurityProfileFormProps, "initialValues"> {
  readonly endDescription: string;
  readonly profile: SecurityProfile;
  readonly submitButtonText: string;
  readonly earlySubmit?: (values: SecurityProfileAddFormValues) => boolean;
}

const SecurityProfileForm: FC<SecurityProfileFormProps> = ({
  benchmarkDisabled,
  earlySubmit = () => false,
  endDescription,
  onSuccess,
  profile,
  submitButtonText,
}) => {
  const { formik, isSubmitting, steps } = useSecurityProfileForm({
    initialValues: {
      day_of_month_type: "day-of-month",
      days: [],
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 1,
      months: [],
      randomize_delivery: "no",
      restart_deliver_delay_window: 1,
      restart_deliver_within: 1,
      start_date: moment().format(INPUT_DATE_TIME_FORMAT),
      start_type: "on-a-date",
      tailoring_file: null,
      unit_of_time: "DAILY",
      ...profile,
    },
    benchmarkDisabled,
    onSuccess,
  });

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const finishSubmit = () => {
    formik.handleSubmit();
  };

  const startSubmit = () => {
    if (earlySubmit(formik.values)) {
      finishSubmit();
      return;
    }

    setIsReadyToSubmit(true);
  };

  const goBack = () => {
    setIsReadyToSubmit(false);
  };

  if (isReadyToSubmit) {
    const step = steps[steps.length - 1];

    return (
      <>
        <p>
          {endDescription} This will{" "}
          {phrase(
            [
              formik.values.mode != "audit" ? "apply fixes" : null,
              formik.values.mode == "fix-restart-audit"
                ? "restart instances"
                : null,
              "generate an audit",
            ].filter((string) => string != null),
          )}{" "}
          on the selected next run date.
        </p>

        {step.content}

        <SidePanelFormButtons
          onBackButtonPress={goBack}
          onSubmit={finishSubmit}
          submitButtonDisabled={!!step.isLoading || isSubmitting}
          submitButtonLoading={step.isLoading || isSubmitting}
          submitButtonText={submitButtonText}
        />
      </>
    );
  }

  return (
    <>
      {steps[0].content}

      {steps.slice(1, -1).map((step, key) => {
        return (
          <div className={classes.container} key={key}>
            {step.content}
          </div>
        );
      })}

      <SidePanelFormButtons
        onSubmit={startSubmit}
        submitButtonDisabled={!formik.isValid || isSubmitting}
        submitButtonLoading={
          steps.some((step) => step.isLoading) || isSubmitting
        }
        submitButtonText={submitButtonText}
      />
    </>
  );
};

export default SecurityProfileForm;
