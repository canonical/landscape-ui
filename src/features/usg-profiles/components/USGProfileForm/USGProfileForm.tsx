import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import usePageParams from "@/hooks/usePageParams";
import type { ReactNode } from "react";
import { useState, type FC } from "react";
import { phrase } from "../../helpers";
import type { UseUSGProfileFormProps } from "../../hooks/useUsgProfileForm";
import useUsgProfileForm from "../../hooks/useUsgProfileForm";
import type { USGProfileFormValues } from "../../types/USGProfileAddFormValues";
import classes from "./USGProfileForm.module.scss";

interface USGProfileFormProps extends UseUSGProfileFormProps {
  readonly getConfirmationStepDisabled?: (
    values: USGProfileFormValues,
  ) => boolean;
  readonly confirmationStepDescription?: ReactNode;
  readonly submitButtonText?: string;
  readonly submitting?: boolean;
}

const USGProfileForm: FC<USGProfileFormProps> = ({
  getConfirmationStepDisabled = () => false,
  confirmationStepDescription,
  submitButtonText = "",
  submitting = false,
  ...props
}) => {
  const { popSidePathUntilClear } = usePageParams();

  const { formik, steps } = useUsgProfileForm(props);

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const finishSubmit = () => {
    formik.handleSubmit();
  };

  const touchValidationFields = async () => {
    await Promise.all([
      formik.setFieldTouched("title", true, false),
      formik.setFieldTouched("benchmark", true, false),
      formik.setFieldTouched("mode", true, false),
      formik.setFieldTouched("start_type", true, false),
      formik.setFieldTouched("start_date", true, false),
      formik.setFieldTouched("every", true, false),
      formik.setFieldTouched("end_date", true, false),
      formik.setFieldTouched("deliver_delay_window", true, false),
      formik.setFieldTouched("restart_deliver_delay", true, false),
    ]);
  };

  const startSubmit = async () => {
    await formik.validateForm();

    const hasInvalidStep = steps.slice(0, -1).some((step) => !step.isValid);
    if (hasInvalidStep) {
      await touchValidationFields();
      return;
    }

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
    const confirmationStepIndex = 4;
    const step = steps[confirmationStepIndex];

    return (
      <>
        <p>
          {confirmationStepDescription} This will{" "}
          {phrase(
            [
              formik.values.mode != "audit" ? "apply fixes" : null,
              formik.values.mode == "audit-fix-restart"
                ? "restart instances"
                : null,
              "generate an audit",
            ].filter((string) => string != null),
          )}{" "}
          on the selected next run date.
        </p>

        {step.content}

        <SidePanelFormButtons
          hasBackButton
          onBackButtonPress={goBack}
          onSubmit={finishSubmit}
          submitButtonLoading={step.isLoading || submitting}
          submitButtonText={submitButtonText}
          onCancel={popSidePathUntilClear}
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
        submitButtonLoading={steps.some((step) => step.isLoading) || submitting}
        submitButtonText={submitButtonText}
        onCancel={popSidePathUntilClear}
      />
    </>
  );
};

export default USGProfileForm;
