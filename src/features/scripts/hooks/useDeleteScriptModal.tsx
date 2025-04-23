import { useState, type ReactNode } from "react";
import type { Script } from "../types";
import { Input } from "@canonical/react-components";
import { useRemoveScript } from "../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

interface DeleteModalResult {
  deleteModalTitle: string;
  deleteModalButtonLabel: string;
  disabledDeleteConfirmation: boolean;
  deleteModalBody: ReactNode;
  isRemoving: boolean;
  onConfirmDelete: () => Promise<void>;
}

export const useDeleteScriptModal = (
  script: Script | null,
): DeleteModalResult => {
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

      notify.success({
        message: `"${script.title}" script removed successfully`,
        title: "Script removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const commonModalFields = {
    deleteModalTitle: "Remove script",
    disabledDeleteConfirmation:
      confirmDeleteProfileText !== `delete ${script.title}` || isRemoving,
    isRemoving,
    onConfirmDelete: handleScriptDelete,
  };

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      deleteModalButtonLabel: "Delete",
      deleteModalBody: (
        <>
          <p>
            Deleting the script will remove the contents from Landscape. This
            action is irreversible.
          </p>
          Type <b>delete {script.title}</b> to confirm.
          <Input
            type="text"
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
          run in the future. This action is irreversible.
        </p>
        Type <b>delete {script.title}</b> to confirm.
        <Input
          type="text"
          value={confirmDeleteProfileText}
          onChange={handleChangeDeleteText}
        />
      </>
    ),
  };
};
