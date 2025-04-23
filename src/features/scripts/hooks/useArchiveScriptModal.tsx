import { useState, type ReactNode } from "react";
import type { Script } from "../types";
import { Input } from "@canonical/react-components";
import { useArchiveScript } from "../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

interface ArchiveModalResult {
  archiveModalTitle: string;
  archiveModalButtonLabel: string;
  disabledArchiveConfirmation: boolean;
  archiveModalBody: ReactNode;
  isArchiving: boolean;
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
  const [confirmArchiveProfileText, setConfirmArchiveProfileText] =
    useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { archiveScript, isArchiving } = useArchiveScript(script?.id || 0);

  const handleChangeArchiveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmArchiveProfileText(e.target.value);
  };

  const handleScriptArchive = async (): Promise<void> => {
    try {
      await archiveScript();

      if (afterSuccess) {
        afterSuccess();
      }

      notify.success({
        message: `"${script?.title}" script archived successfully`,
        title: "Script archived",
      });
    } catch (error) {
      debug(error);
    }
  };

  const commonModalFields = {
    archiveModalTitle: "Archive script",
    disabledArchiveConfirmation:
      confirmArchiveProfileText !== `archive ${script?.title}` || isArchiving,
    isArchiving,
    onConfirmArchive: handleScriptArchive,
  };

  if (!script) {
    return {
      archiveModalTitle: "",
      archiveModalButtonLabel: "",
      disabledArchiveConfirmation: false,
      archiveModalBody: <></>,
      isArchiving: false,
      onConfirmArchive: async () => {
        debug("Script not loaded");
      },
    };
  }

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      archiveModalButtonLabel: "Archive",
      archiveModalBody: (
        <>
          <p>
            Archiving the script will prevent it from running in the future.
            This action is irreversible.
          </p>
          Type <b>archive {script.title}</b> to confirm.
          <Input
            type="text"
            value={confirmArchiveProfileText}
            onChange={handleChangeArchiveText}
          />
        </>
      ),
    };
  }

  return {
    ...commonModalFields,
    archiveModalButtonLabel: "Archive both script and profiles",
    archiveModalBody: (
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
          If you archive the script and the profiles, they won’t be able to run
          in the future. This action is irreversible.
        </p>
        Type <b>archive {script.title}</b> to confirm.
        <Input
          type="text"
          value={confirmArchiveProfileText}
          onChange={handleChangeArchiveText}
        />
      </>
    ),
  };
};
