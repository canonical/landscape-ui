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

      notify.success({
        message: `The script named "${script.title}" was redacted successfully`,
        title: "Script redacted",
      });
    } catch (error) {
      debug(error);
    } finally {
      afterSuccess();
    }
  };

  const commonModalFields = {
    deleteModalTitle: `Redact ${script.title}`,
    isRemoving,
    onConfirmDelete: handleScriptDelete,
  };

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      deleteModalButtonLabel: "Redact",
      deleteModalBody: (
        <p>
          Redacting this script will permanently remove its contents from
          Landscape. However, a record of the script, including who redacted it
          and when, will be retained in the database. The script name{" "}
          <strong>cannot be reused as a result.</strong>
          <br />
          <br />
          This action is <strong>irreversible</strong>.
        </p>
      ),
    };
  }

  return {
    ...commonModalFields,
    deleteModalButtonLabel: "Redact script and archive profiles",
    deleteModalBody: (
      <>
        <p>
          Redacting this script will permanently remove its contents from
          Landscape. However, a record of the script, including who redacted it
          and when, will be retained in the database. The script name{" "}
          <strong>cannot be reused as a result.</strong>
          <br />
          <br />
          The script is also associated with the following profiles:
        </p>
        <ul>
          {script.script_profiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        <p>
          Redacting the script will archive its associated profiles, making
          their names unavailable for reuse. Neither the script nor its profiles
          will be able to run again.
          <br />
          <br />
          This action is <strong>irreversible</strong>.
        </p>
      </>
    ),
  };
};
