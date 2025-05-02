import { type ReactNode } from "react";
import type { Script } from "../types";
import { useRemoveScript } from "../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

interface DeleteModalResult {
  deleteModalTitle: string;
  deleteModalButtonLabel: string;
  deleteModalBody: ReactNode;
  isRemoving: boolean;
  onConfirmDelete: () => Promise<void>;
}

interface DeleteModalProps {
  script: Script | null;
  afterSuccess: () => void;
}

export const useDeleteScriptModal = ({
  script,
  afterSuccess,
}: DeleteModalProps): DeleteModalResult => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { removeScript, isRemoving } = useRemoveScript();

  if (!script) {
    return {
      deleteModalTitle: "",
      deleteModalButtonLabel: "",
      deleteModalBody: <></>,
      isRemoving: false,
      onConfirmDelete: async () => {
        debug("Script not loaded");
      },
    };
  }

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
    isRemoving,
    onConfirmDelete: handleScriptDelete,
  };

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      deleteModalButtonLabel: "Delete",
      deleteModalBody: (
        <p>
          Deleting the script will remove the contents from Landscape.
          <br />
          This action is <b>irreversible</b>.
        </p>
      ),
    };
  }

  return {
    ...commonModalFields,
    deleteModalButtonLabel: "Delete both script and profiles",
    deleteModalBody: (
      <>
        <p>
          Deleting the script will remove the contents from Landscape. The
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
      </>
    ),
  };
};
