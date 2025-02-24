import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Icon,
  Modal,
} from "@canonical/react-components";
import type { FC } from "react";
import { useEffect, useState } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFile } from "../../types";
import AutoinstallFileForm from "../AutoinstallFileForm";
import classes from "./ViewAutoinstallFileDetailsEditButton.module.scss";
import {
  CANCEL_BUTTON_TEXT,
  CONTINUE_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  LOCAL_STORAGE_ITEM,
  SUBMIT_BUTTON_TEXT,
} from "./constants";

const ViewAutoinstallFileDetailsEditButton: FC<{
  readonly file: AutoinstallFile;
}> = ({ file }) => {
  const [modalState, setModalState] = useState<
    "visible" | "invisible" | "ignored"
  >("invisible");
  const [isChecked, setIsChecked] = useState(false);
  const { setSidePanelContent } = useSidePanel();

  const {
    updateAutoinstallFileQuery: { mutateAsync: updateAutoinstallFile },
  } = useAutoinstallFiles();

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_ITEM)) {
      setModalState("ignored");
    }
  }, []);

  const closeModal = (): void => {
    setModalState("invisible");
    setIsChecked(false);
  };

  const continueEditing = (): void => {
    if (isChecked) {
      setModalState("ignored");

      localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    } else {
      setModalState("invisible");
    }

    showSidePanel();
  };

  const showSidePanel = (): void => {
    setSidePanelContent(
      `Edit ${file.filename}`,
      <AutoinstallFileForm
        buttonText={SUBMIT_BUTTON_TEXT}
        description={`The duplicated ${file.filename} will inherit the Employee group assignments of the original file.`}
        initialFile={file}
        notification={{
          message:
            "has been edited and all the changes made have been saved successfully.",
          title: "You have successfully saved changes for",
        }}
        query={async ({ contents }) => {
          await updateAutoinstallFile({ contents, id: file.id });
        }}
      />,
    );
  };

  return (
    <>
      <Button
        className="p-segmented-control__button"
        onClick={() => {
          if (modalState === "ignored") {
            showSidePanel();
          } else {
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
          title={
            <span className={classes.capitalize}>
              Edit history limit reached
            </span>
          }
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
                <span className={classes.capitalize}>
                  {CONTINUE_BUTTON_TEXT}
                </span>
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
