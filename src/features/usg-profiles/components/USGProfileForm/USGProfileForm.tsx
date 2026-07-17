import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import usePageParams from "@/hooks/usePageParams";
import type { FormikErrors } from "formik";
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

const VALIDATION_FIELDS: (keyof USGProfileFormValues)[] = [
  "title",
  "benchmark",
  "mode",
  "start_type",
  "start_date",
  "every",
  "days",
  "months",
  "end_date",
  "deliver_delay_window",
  "restart_deliver_delay",
];

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
    await Promise.all(
      VALIDATION_FIELDS.map((field) =>
        formik.setFieldTouched(field, true, false),
      ),
    );
  };

  const hasValidationErrors = (errors: FormikErrors<USGProfileFormValues>) => {
    return VALIDATION_FIELDS.some((field) => !!errors[field]);
  };

  const startSubmit = async () => {
    const errors = await formik.validateForm();

    if (hasValidationErrors(errors)) {
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
