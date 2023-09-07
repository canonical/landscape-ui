import { FC } from "react";
import { CheckboxInput, Input, Modal } from "@canonical/react-components";
import classes from "./ActivityConfirmation.module.scss";

export interface ActivityProps {
  title: string;
  description: string;
  acceptButton: {
    label: string;
    onClick: () => void;
  };
}

interface ActivityConfirmationProps {
  onClose: () => void;
  checkboxValue: boolean;
  onCheckboxChange: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  activityProps: ActivityProps | null;
}

const ActivityConfirmation: FC<ActivityConfirmationProps> = ({
  onClose,
  checkboxValue,
  onCheckboxChange,
  inputValue,
  onInputChange,
  activityProps,
}) => {
  return (
    null !== activityProps && (
      <Modal
        title={activityProps.title}
        close={onClose}
        buttonRow={
          <>
            <button
              className="u-no-margin--bottom"
              aria-controls="modal"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="p-button--negative u-no-margin--bottom"
              onClick={activityProps.acceptButton.onClick}
              disabled={
                !checkboxValue && new Date(inputValue).getTime() < Date.now()
              }
            >
              {activityProps.acceptButton.label}
            </button>
          </>
        }
      >
        <div className={classes.wrapper}>
          <CheckboxInput
            label="Deliver as soon as possible"
            checked={checkboxValue}
            onChange={onCheckboxChange}
          />
          <Input
            type="datetime-local"
            label="Schedule time"
            labelClassName="u-off-screen"
            className={classes.input}
            placeholder="Scheduled time"
            value={inputValue}
            onChange={(event) => {
              onInputChange(event.target.value);
            }}
            disabled={checkboxValue}
            error={
              new Date(inputValue).getTime() < Date.now() &&
              "Schedule time must be in the future"
            }
          />
          <p>{activityProps.description}</p>
        </div>
      </Modal>
    )
  );
};

export default ActivityConfirmation;
