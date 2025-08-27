import { ActionButton, Button, Icon } from "@canonical/react-components";
import type { FC, ReactElement, ReactNode, SyntheticEvent } from "react";
import useSidePanel from "../../hooks/useSidePanel";
import classes from "./SidePanelFormButtons.module.scss";

interface SidePanelFormButtonsProps {
  readonly submitButtonDisabled?: boolean;
  readonly submitButtonText?: string;
  readonly submitButtonAppearance?: "positive" | "negative" | "secondary";
  readonly submitButtonAriaLabel?: string;
  readonly submitButtonLoading?: boolean;
  readonly secondaryActionButtonTitle?: ReactNode;
  readonly secondaryActionButtonSubmit?: (
    event: SyntheticEvent,
  ) => Promise<void> | void;
  readonly cancelButtonDisabled?: boolean;
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
  secondaryActionButtonSubmit,
  onBackButtonPress,
  onCancel,
  onSubmit,
  submitButtonAppearance = "positive",
  cancelButtonDisabled = false,
}): ReactElement<Element> => {
  const { closeSidePanel } = useSidePanel();
  return (
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
            >
              <>{secondaryActionButtonTitle}</>
            </Button>
          )}
          <ActionButton
            className="u-no-margin--bottom"
            type={onSubmit ? "button" : "submit"}
            onClick={onSubmit}
            appearance={submitButtonAppearance}
            disabled={submitButtonDisabled}
            aria-label={submitButtonAriaLabel}
            loading={submitButtonLoading}
          >
            {submitButtonText}
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default SidePanelFormButtons;
