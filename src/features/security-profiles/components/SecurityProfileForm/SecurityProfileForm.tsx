import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { ReactNode } from "react";
import { useState, type FC } from "react";
import { phrase } from "../../helpers";
import type { UseSecurityProfileFormProps } from "../../hooks/useSecurityProfileForm";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfileFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileForm.module.scss";

interface SecurityProfileFormProps extends UseSecurityProfileFormProps {
  readonly getConfirmationStepDisabled?: (
    values: SecurityProfileFormValues,
  ) => boolean;
  readonly confirmationStepDescription?: ReactNode;
  readonly submitButtonText?: string;
  readonly submitting?: boolean;
}

const SecurityProfileForm: FC<SecurityProfileFormProps> = ({
  getConfirmationStepDisabled = () => false,
  confirmationStepDescription,
  submitButtonText = "",
  submitting = false,
  ...props
}) => {
  const { formik, steps } = useSecurityProfileForm(props);

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const finishSubmit = () => {
    formik.handleSubmit();
  };

  const startSubmit = () => {
    if (getConfirmationStepDisabled(formik.values)) {
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
          {confirmationStepDescription} This will{" "}
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
          submitButtonDisabled={!!step.isLoading || submitting}
          submitButtonLoading={step.isLoading || submitting}
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
        submitButtonDisabled={
          !formik.isValid || submitting || !formik.touched.start_type
        }
        submitButtonLoading={steps.some((step) => step.isLoading) || submitting}
        submitButtonText={submitButtonText}
      />
    </>
  );
};

export default SecurityProfileForm;
