import {
  Button,
  CheckboxInput,
  Icon,
  Modal,
} from "@canonical/react-components";
import { FC, useEffect, useState } from "react";
import classes from "./ViewAutoinstallFileDetailsEditButton.module.scss";
import {
  CANCEL_BUTTON_TEXT,
  CONTINUE_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  LOCAL_STORAGE_ITEM,
} from "./constants";

const ViewAutoinstallFileDetailsEditButton: FC = () => {
  const [modalState, setModalState] = useState<
    "visible" | "invisible" | "ignored"
  >("invisible");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_ITEM)) {
      setModalState("ignored");
    }
  }, []);

  const closeModal = () => {
    setModalState("invisible");
    setIsChecked(false);
  };

  const continueEditing = () => {
    if (isChecked) {
      setModalState("ignored");

      localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    } else {
      setModalState("invisible");
    }
  };

  return (
    <>
      <Button
        className="p-segmented-control__button"
        onClick={() => {
          if (modalState !== "ignored") {
            setModalState("visible");
          }
        }}
      >
        <Icon name="edit" />
        <span>{EDIT_BUTTON_TEXT}</span>
      </Button>

      {modalState === "visible" && (
        <Modal
          close={closeModal}
          title="Edit history limit reached"
          buttonRow={
            <>
              <Button appearance="base" onClick={closeModal}>
                {CANCEL_BUTTON_TEXT}
              </Button>

              <Button
                appearance="positive"
                className="u-no-margin--bottom"
                onClick={continueEditing}
              >
                {CONTINUE_BUTTON_TEXT}
              </Button>
            </>
          }
        >
          <p className={classes.message}>
            You&apos;ve reached the maximum of 100 saved edits for this file. To
            continue editing, the system will remove the oldest version to make
            space for your new changes. This ensures that the most recent 100
            versions are always retained in the history.
          </p>

          <CheckboxInput
            label="I understand. Don't show this message again."
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            checked={isChecked}
          />
        </Modal>
      )}
    </>
  );
};

export default ViewAutoinstallFileDetailsEditButton;
