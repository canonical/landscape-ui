import useSidePanel from "@/hooks/useSidePanel";
import { ActionButton, Button, Icon } from "@canonical/react-components";
import type { FC, ReactElement, ReactNode, SyntheticEvent } from "react";
import { useState } from "react";
import classes from "./SidePanelFormButtons.module.scss";

interface SidePanelFormButtonsProps {
  readonly submitButtonDisabled?: boolean;
  readonly submitButtonText?: string;
  readonly submitButtonAppearance?: "positive" | "negative" | "secondary";
  readonly submitButtonAriaLabel?: string;
  readonly submitButtonLoading?: boolean;
  readonly secondaryActionButtonTitle?: ReactNode;
  readonly secondaryActionButtonDisabled?: boolean;
  readonly secondaryActionButtonSubmit?: (
    event: SyntheticEvent,
  ) => Promise<void> | void;
  readonly cancelButtonDisabled?: boolean;
  readonly formError?: ReactNode;
  readonly formWarning?: ReactNode;
  readonly hasActionButtons?: boolean;
  readonly hasBackButton?: boolean;
  readonly onBackButtonPress?: () => void;
  readonly onCancel?: () => void;
  readonly onSubmit?: (event: SyntheticEvent) => Promise<void> | void;
}

const SidePanelFormButtons: FC<SidePanelFormButtonsProps> = ({
  hasActionButtons = true,
  hasBackButton,
  submitButtonDisabled,
  submitButtonLoading = false,
  submitButtonText,
  submitButtonAriaLabel,
  secondaryActionButtonTitle,
  secondaryActionButtonDisabled,
  secondaryActionButtonSubmit,
  onBackButtonPress,
  onCancel,
  onSubmit,
  submitButtonAppearance = "positive",
  cancelButtonDisabled = false,
  formError,
  formWarning,
}): ReactElement<Element> => {
  const { closeSidePanel } = useSidePanel();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleSubmit = (event: SyntheticEvent) => {
    setHasAttemptedSubmit(true);
    return onSubmit?.(event);
  };

  return (
    <div className={classes.footer}>
      {formError && hasAttemptedSubmit ? (
        <div className={classes.formValidation} role="alert">
          <Icon name="error" />
          <span className="u-text--negative">{formError}</span>
        </div>
      ) : (
        formWarning && (
          <div className={classes.formValidation} role="alert">
            <Icon name="warning" />
            <span className="u-text--caution">{formWarning}</span>
          </div>
        )
      )}
      <div className={classes.buttons}>
        {hasBackButton && (
          <Button
            hasIcon
            className="u-no-margin--bottom"
            appearance="base"
            type="button"
            onClick={onBackButtonPress}
          >
            <Icon name="chevron-left" />
            <span>Back</span>
          </Button>
        )}
        {hasActionButtons && (
          <div className={classes.actionButtons}>
            <Button
              className="u-no-margin--bottom"
              type="button"
              appearance="base"
              onClick={onCancel ?? closeSidePanel}
              disabled={cancelButtonDisabled}
            >
              Cancel
            </Button>
            {secondaryActionButtonTitle && secondaryActionButtonSubmit && (
              <Button
                type="button"
                className="u-no-margin--bottom"
                onClick={secondaryActionButtonSubmit}
                disabled={secondaryActionButtonDisabled}
              >
                <>{secondaryActionButtonTitle}</>
              </Button>
            )}
            <ActionButton
              className="u-no-margin--bottom"
              type={onSubmit ? "button" : "submit"}
              onClick={handleSubmit}
              appearance={submitButtonAppearance}
              disabled={submitButtonDisabled || submitButtonLoading}
              aria-label={submitButtonAriaLabel}
              loading={submitButtonLoading}
            >
              {submitButtonText}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanelFormButtons;
