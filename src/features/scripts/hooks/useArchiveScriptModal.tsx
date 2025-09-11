import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { type ReactNode } from "react";
import { useArchiveScript } from "../api";
import type { Script } from "../types";

interface ArchiveModalResult {
  archiveModalTitle: string;
  archiveModalButtonLabel: string;
  archiveModalBody: ReactNode;
  isArchivingScript: boolean;
  onConfirmArchive: () => Promise<void>;
}

interface ArchiveModalProps {
  script: Script | null;
  afterSuccess: () => void;
}

export const useArchiveScriptModal = ({
  script,
  afterSuccess,
}: ArchiveModalProps): ArchiveModalResult => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { archiveScript, isArchivingScript } = useArchiveScript();

  if (!script) {
    return {
      archiveModalTitle: "",
      archiveModalButtonLabel: "",
      archiveModalBody: <></>,
      isArchivingScript: false,
      onConfirmArchive: async () => {
        debug("Script not loaded");
      },
    };
  }

  const handleScriptArchive = async (): Promise<void> => {
    try {
      await archiveScript(script.id || 0);

      notify.success({
        message: `"${script.title}" script archived successfully`,
        title: "Script archived",
      });
    } catch (error) {
      debug(error);
    } finally {
      afterSuccess();
    }
  };

  const commonModalFields = {
    archiveModalTitle: `Archive ${script.title}`,
    isArchivingScript,
    onConfirmArchive: handleScriptArchive,
  };

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      archiveModalButtonLabel: "Archive",
      archiveModalBody: (
        <p>
          Archiving the script will prevent it from running in the future.
          <br />
          This action is <b>irreversible</b>.
        </p>
      ),
    };
  }

  return {
    ...commonModalFields,
    archiveModalButtonLabel: "Archive both script and profiles",
    archiveModalBody: (
      <>
        <p>
          Archiving the script will prevent it from running in the future.
          <br />
          The script is associated with the following profiles:
        </p>
        <ul>
          {script.script_profiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        <p>
          If you archive the script and the profiles, they won’t be able to run
          in the future.
          <br />
          This action is <b>irreversible</b>.
        </p>
      </>
    ),
  };
};
