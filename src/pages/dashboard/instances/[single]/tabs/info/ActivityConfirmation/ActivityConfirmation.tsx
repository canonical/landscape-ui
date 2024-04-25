import { FC } from "react";
import {
  Button,
  CheckboxInput,
  Input,
  Modal,
} from "@canonical/react-components";
import { ActivityProps } from "@/pages/dashboard/instances/[single]/tabs/info/types";
import classes from "./ActivityConfirmation.module.scss";

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
            <Button aria-controls="modal" onClick={onClose}>
              Cancel
            </Button>
            <Button
              appearance="negative"
              onClick={activityProps.acceptButton.onClick}
              disabled={
                !checkboxValue && new Date(inputValue).getTime() < Date.now()
              }
            >
              {activityProps.acceptButton.label}
            </Button>
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
