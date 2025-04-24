import { useState, type ReactNode } from "react";
import type { Script } from "../types";
import { Input } from "@canonical/react-components";
import { useRemoveScript } from "../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "../styles.module.scss";

interface DeleteModalResult {
  deleteModalTitle: string;
  deleteModalButtonLabel: string;
  disabledDeleteConfirmation: boolean;
  deleteModalBody: ReactNode;
  isRemoving: boolean;
  onConfirmDelete: () => Promise<void>;
  resetDeleteModal: () => void;
}

interface DeleteModalProps {
  script: Script | null;
  afterSuccess: () => void;
}

export const useDeleteScriptModal = ({
  script,
  afterSuccess,
}: DeleteModalProps): DeleteModalResult => {
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();

  if (!script) {
    return {
      deleteModalTitle: "",
      deleteModalButtonLabel: "",
      disabledDeleteConfirmation: false,
      deleteModalBody: <></>,
      isRemoving: false,
      onConfirmDelete: async () => {
        debug("Script not loaded");
      },
      resetDeleteModal: () => {
        setConfirmDeleteProfileText("");
      },
    };
  }

  const { removeScript, isRemoving } = useRemoveScript();

  const handleChangeDeleteText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(e.target.value);
  };

  const handleScriptDelete = async (): Promise<void> => {
    try {
      await removeScript({
        script_id: script.id,
      });

      afterSuccess();
      notify.success({
        message: `"${script.title}" script removed successfully`,
        title: "Script removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const commonModalFields = {
    deleteModalTitle: `Delete ${script.title}`,
    disabledDeleteConfirmation:
      confirmDeleteProfileText !== `delete ${script.title}` || isRemoving,
    isRemoving,
    onConfirmDelete: handleScriptDelete,
    resetDeleteModal: () => {
      setConfirmDeleteProfileText("");
    },
  };

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      deleteModalButtonLabel: "Delete",
      deleteModalBody: (
        <>
          <p>
            Deleting the script will remove the contents from Landscape.
            <br />
            This action is <b>irreversible</b>.
          </p>
          <p className={classes.confirmationPrompt}>
            Type <b>delete {script.title}</b> to confirm.
          </p>
          <Input
            type="text"
            autoComplete="off"
            placeholder={`delete ${script.title}`}
            value={confirmDeleteProfileText}
            onChange={handleChangeDeleteText}
          />
        </>
      ),
    };
  }

  return {
    ...commonModalFields,
    deleteModalButtonLabel: "Delete both script and profiles",
    deleteModalBody: (
      <>
        <p>
          Archiving the script will prevent it from running in the future. The
          script is associated with the following profiles:
        </p>
        <ul>
          {script.script_profiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        <p>
          If you delete the script, the script and its profiles won’t be able to
          run in the future. <br />
          This action is <b>irreversible</b>.
        </p>
        <p className={classes.confirmationPrompt}>
          Type <b>delete {script.title}</b> to confirm.
        </p>
        <Input
          type="text"
          autoComplete="off"
          placeholder={`delete ${script.title}`}
          value={confirmDeleteProfileText}
          onChange={handleChangeDeleteText}
        />
      </>
    ),
  };
};
