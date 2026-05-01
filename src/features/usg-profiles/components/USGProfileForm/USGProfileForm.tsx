import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import usePageParams from "@/hooks/usePageParams";
import type { ComponentProps, ReactNode } from "react";
import { useState, type FC } from "react";
import { phrase } from "../../helpers";
import type { UseUSGProfileFormProps } from "../../hooks/useUsgProfileForm";
import useUsgProfileForm from "../../hooks/useUsgProfileForm";
import type { USGProfileFormValues } from "../../types/USGProfileAddFormValues";
import classes from "./USGProfileForm.module.scss";

interface USGProfileFormProps
  extends
    UseUSGProfileFormProps,
    Pick<
      ComponentProps<typeof SidePanelFormButtons>,
      "hasBackButton" | "onBackButtonPress"
    > {
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
  hasBackButton,
  onBackButtonPress,
  ...props
}) => {
  const { createPageParamsSetter } = usePageParams();

  const { formik, steps } = useUsgProfileForm(props);

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
          submitButtonDisabled={!!step.isLoading || submitting}
          submitButtonLoading={step.isLoading || submitting}
          submitButtonText={submitButtonText}
          onCancel={createPageParamsSetter({ sidePath: [], name: "" })}
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
        submitButtonDisabled={!formik.isValid || submitting}
        submitButtonLoading={steps.some((step) => step.isLoading) || submitting}
        submitButtonText={submitButtonText}
        hasBackButton={hasBackButton}
        onBackButtonPress={onBackButtonPress}
        onCancel={createPageParamsSetter({ sidePath: [], name: "" })}
      />
    </>
  );
};

export default USGProfileForm;
